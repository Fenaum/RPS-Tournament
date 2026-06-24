const PLAYER_LIMIT = 20;
const CHOICES = new Set(["rock", "paper", "scissors"]);
const WINNING_CHOICES = {
  rock: "scissors",
  paper: "rock",
  scissors: "paper",
};
const CHOICE_LIST = Array.from(CHOICES);

function createTournamentManager(io) {
  const queue = [];
  const leaderboard = {};
  let tournament = null;
  let tournamentNumber = 0;
  let cpuNumber = 0;

  function publicPlayer(player) {
    return {
      id: player.id,
      name: player.name,
      isCpu: Boolean(player.isCpu),
      points: leaderboard[player.id]?.points || 0,
    };
  }

  function emitLobby() {
    io.emit("queue-update", {
      maxPlayers: PLAYER_LIMIT,
      players: queue.map(publicPlayer),
      leaderboard: getLeaderboard(),
      tournament: getPublicTournament(),
    });
  }

  function getLeaderboard() {
    return Object.values(leaderboard)
      .sort((a, b) => b.points - a.points || a.name.localeCompare(b.name))
      .map((entry) => ({ ...entry }));
  }

  function getPublicTournament() {
    if (!tournament) return null;

    return {
      id: tournament.id,
      status: tournament.status,
      currentRound: tournament.currentRound,
      champion: tournament.champion ? publicPlayer(tournament.champion) : null,
      rounds: tournament.rounds.map((round) => ({
        number: round.number,
        name: round.name,
        status: round.status,
        matches: round.matches.map((match) => ({
          id: match.id,
          status: match.status,
          player1: match.player1 ? publicPlayer(match.player1) : null,
          player2: match.player2 ? publicPlayer(match.player2) : null,
          winner: match.winner ? publicPlayer(match.winner) : null,
          tied: match.tied,
        })),
      })),
    };
  }

  function enqueue(socket, rawName) {
    if (tournament?.status === "active") {
      socket.emit("queue-error", "A tournament is already running.");
      return;
    }

    if (queue.some((player) => player.id === socket.id)) {
      socket.emit("queue-error", "You are already in the queue.");
      return;
    }

    if (queue.length >= PLAYER_LIMIT) {
      socket.emit("queue-error", "The tournament queue is full.");
      return;
    }

    const trimmedName = `${rawName || ""}`.trim();
    const fallbackName = `Player ${queue.length + 1}`;
    const player = {
      id: socket.id,
      name: trimmedName.slice(0, 24) || fallbackName,
    };

    leaderboard[player.id] ||= { id: player.id, name: player.name, points: 0 };
    leaderboard[player.id].name = player.name;

    queue.push(player);
    socket.join("tournament");
    socket.emit("player-registered", publicPlayer(player));
    emitLobby();

    if (queue.length === PLAYER_LIMIT) {
      startTournament();
    }
  }

  function fillWithCpu(socket) {
    if (tournament?.status === "active") {
      socket.emit("queue-error", "A tournament is already running.");
      return;
    }

    while (queue.length < PLAYER_LIMIT) {
      cpuNumber += 1;
      const cpu = {
        id: `cpu-${Date.now()}-${cpuNumber}`,
        name: `CPU ${cpuNumber}`,
        isCpu: true,
      };

      leaderboard[cpu.id] = {
        id: cpu.id,
        name: cpu.name,
        isCpu: true,
        points: 0,
      };
      queue.push(cpu);
    }

    emitLobby();
    startTournament();
  }

  function leave(socket) {
    const queuedIndex = queue.findIndex((player) => player.id === socket.id);
    if (queuedIndex !== -1) {
      queue.splice(queuedIndex, 1);
      socket.leave("tournament");
      emitLobby();
      return;
    }

    if (!tournament || tournament.status !== "active") return;

    const match = findActiveMatchForPlayer(socket.id);
    if (!match) return;

    const winner = match.player1?.id === socket.id ? match.player2 : match.player1;
    if (winner) {
      completeMatch(match, winner, "opponent-left");
    }
  }

  function startTournament() {
    const players = queue.splice(0, PLAYER_LIMIT);
    tournamentNumber += 1;
    tournament = {
      id: `tournament-${tournamentNumber}`,
      status: "active",
      currentRound: 1,
      champion: null,
      rounds: [],
    };

    createRound(players, "Opening Round");
    io.to("tournament").emit("tournament-started", getPublicTournament());
    emitLobby();
  }

  function createRound(players, name) {
    const roundNumber = tournament.rounds.length + 1;
    const byesNeeded = getByesNeeded(players.length);
    const playersWithByes = players.slice(0, byesNeeded);
    const playersToMatch = players.slice(byesNeeded);
    const matches = [];

    for (const byePlayer of playersWithByes) {
      awardPoints(byePlayer, 1);
      matches.push({
        id: `${tournament.id}-r${roundNumber}-m${matches.length + 1}`,
        status: "bye",
        player1: byePlayer,
        player2: null,
        moves: {},
        winner: byePlayer,
        tied: false,
      });
    }

    for (let index = 0; index < playersToMatch.length; index += 2) {
      const player1 = playersToMatch[index];
      const player2 = playersToMatch[index + 1];
      matches.push({
        id: `${tournament.id}-r${roundNumber}-m${matches.length + 1}`,
        status: "active",
        player1,
        player2,
        moves: {},
        winner: null,
        tied: false,
      });

      const match = matches[matches.length - 1];
      notifyHuman(player1, "match-ready", {
        matchId: match.id,
        opponent: publicPlayer(player2),
      });
      notifyHuman(player2, "match-ready", {
        matchId: match.id,
        opponent: publicPlayer(player1),
      });
    }

    tournament.currentRound = roundNumber;
    tournament.rounds.push({
      number: roundNumber,
      name,
      status: "active",
      matches,
    });
    queueMicrotask(playCpuTurns);
  }

  function getByesNeeded(playerCount) {
    if (playerCount <= 1) return playerCount;

    let bracketSize = 1;
    while (bracketSize * 2 <= playerCount) {
      bracketSize *= 2;
    }

    if (bracketSize === playerCount) return 0;

    return 2 * bracketSize - playerCount;
  }

  function submitMove(socket, payload) {
    if (!tournament || tournament.status !== "active") {
      socket.emit("move-error", "No active tournament.");
      return;
    }

    const choice = `${payload?.choice || ""}`.toLowerCase();
    if (!CHOICES.has(choice)) {
      socket.emit("move-error", "Choose rock, paper, or scissors.");
      return;
    }

    const match = findActiveMatchForPlayer(socket.id);
    if (!match) {
      socket.emit("move-error", "You do not have an active match.");
      return;
    }

    match.moves[socket.id] = choice;
    socket.emit("move-accepted", { choice });
    notifyMatchPlayers(match, "match-update", {
      matchId: match.id,
      waitingForOpponent: Object.keys(match.moves).length < 2,
    });

    if (Object.keys(match.moves).length === 2) {
      resolveMatch(match);
      return;
    }

    playCpuTurns();
  }

  function resolveMatch(match) {
    const player1Choice = match.moves[match.player1.id];
    const player2Choice = match.moves[match.player2.id];

    if (player1Choice === player2Choice) {
      match.moves = {};
      match.tied = true;
      notifyMatchPlayers(match, "round-tied", {
        matchId: match.id,
        choice: player1Choice,
      });
      io.to("tournament").emit("tournament-update", getPublicTournament());
      queueMicrotask(playCpuTurns);
      return;
    }

    const winner =
      WINNING_CHOICES[player1Choice] === player2Choice ? match.player1 : match.player2;
    completeMatch(match, winner, "choice");
  }

  function completeMatch(match, winner, reason) {
    match.status = "complete";
    match.winner = winner;
    match.moves = {};
    match.tied = false;
    awardPoints(winner, reason === "opponent-left" ? 2 : 3);

    notifyMatchPlayers(match, "match-complete", {
      matchId: match.id,
      winner: publicPlayer(winner),
      reason,
    });

    const round = tournament.rounds[tournament.rounds.length - 1];
    if (round.matches.every((roundMatch) => roundMatch.winner)) {
      finishRound(round);
    } else {
      io.to("tournament").emit("tournament-update", getPublicTournament());
      emitLobby();
    }
  }

  function finishRound(round) {
    round.status = "complete";
    const winners = round.matches.map((match) => match.winner);

    if (winners.length === 1) {
      tournament.status = "complete";
      tournament.champion = winners[0];
      awardPoints(winners[0], 5);
      io.to("tournament").emit("tournament-complete", getPublicTournament());
      emitLobby();
      return;
    }

    const nextName = winners.length === 16 ? "Round of 16" :
      winners.length === 8 ? "Quarterfinals" :
      winners.length === 4 ? "Semifinals" :
      winners.length === 2 ? "Final" :
      `Round ${tournament.rounds.length + 1}`;

    createRound(winners, nextName);
    io.to("tournament").emit("tournament-update", getPublicTournament());
    emitLobby();
  }

  function playCpuTurns() {
    if (!tournament || tournament.status !== "active") return;

    const round = tournament.rounds[tournament.rounds.length - 1];
    if (!round || round.status !== "active") return;

    for (const match of round.matches) {
      if (match.status !== "active") continue;

      submitCpuMove(match, match.player1);
      submitCpuMove(match, match.player2);

      if (Object.keys(match.moves).length === 2) {
        resolveMatch(match);
      }
    }
  }

  function submitCpuMove(match, player) {
    if (!player?.isCpu || match.moves[player.id]) return;

    match.moves[player.id] =
      CHOICE_LIST[Math.floor(Math.random() * CHOICE_LIST.length)];
  }

  function awardPoints(player, points) {
    leaderboard[player.id] ||= { id: player.id, name: player.name, points: 0 };
    leaderboard[player.id].points += points;
  }

  function findActiveMatchForPlayer(playerId) {
    const round = tournament?.rounds[tournament.rounds.length - 1];
    return round?.matches.find(
      (match) =>
        match.status === "active" &&
        (match.player1?.id === playerId || match.player2?.id === playerId)
    );
  }

  function notifyMatchPlayers(match, event, payload) {
    notifyHuman(match.player1, event, payload);
    notifyHuman(match.player2, event, payload);
  }

  function notifyHuman(player, event, payload) {
    if (!player || player.isCpu) return;
    io.to(player.id).emit(event, payload);
  }

  return {
    enqueue,
    fillWithCpu,
    leave,
    submitMove,
    emitLobby,
  };
}

module.exports = { createTournamentManager, PLAYER_LIMIT };
