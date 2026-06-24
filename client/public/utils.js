export const appState = {
  player: null,
  currentMatch: null,
  tournament: null,
  queuedPlayerIds: new Set(),
};

export function setConnectionStatus(text, connected = false) {
  const element = document.getElementById("connection-status");
  element.textContent = text;
  element.classList.toggle("connected", connected);
}

export function renderQueue({ players, maxPlayers }) {
  appState.queuedPlayerIds = new Set(players.map((player) => player.id));

  const count = document.getElementById("queue-count");
  const meter = document.getElementById("queue-meter-fill");
  const list = document.getElementById("queue-list");
  const lobbyMessage = document.getElementById("lobby-message");

  count.textContent = `${players.length}/${maxPlayers}`;
  meter.style.width = `${Math.round((players.length / maxPlayers) * 100)}%`;

  if (!players.length) {
    list.innerHTML = `<p class="empty-state">No players in queue.</p>`;
  } else {
    list.innerHTML = players
      .map(
        (player, index) => `
          <div class="queue-player${player.isCpu ? " cpu-player" : ""}">
            <span>${index + 1}</span>
            <strong>${escapeHtml(player.name)}</strong>
            ${player.isCpu ? "<em>CPU</em>" : ""}
          </div>
        `
      )
      .join("");
  }

  const remaining = maxPlayers - players.length;
  lobbyMessage.textContent = remaining
    ? `${remaining} more player${remaining === 1 ? "" : "s"} needed.`
    : "Queue full. Starting tournament.";
}

export function renderLeaderboard(players) {
  const list = document.getElementById("leaderboard-list");

  if (!players.length) {
    list.innerHTML = `<li class="empty-state">No points yet.</li>`;
    return;
  }

  list.innerHTML = players
    .slice(0, 10)
    .map(
      (player) => `
        <li${player.isCpu ? ' class="cpu-score"' : ""}>
          <span>${escapeHtml(player.name)}</span>
          <strong>${player.isCpu ? "CPU " : ""}${player.points}</strong>
        </li>
      `
    )
    .join("");
}

export function renderTournament(tournament) {
  appState.tournament = tournament;
  const title = document.getElementById("tournament-title");
  const bracket = document.getElementById("bracket");

  if (!tournament) {
    title.textContent = "No tournament yet";
    bracket.className = "bracket-empty";
    bracket.textContent = "Queue fills to 20 players.";
    return;
  }

  title.textContent =
    tournament.status === "complete" && tournament.champion
      ? `Champion: ${tournament.champion.name}`
      : `Tournament ${tournament.id.replace("tournament-", "#")}`;

  bracket.className = "bracket";
  bracket.innerHTML = tournament.rounds
    .map(
      (round) => `
        <section class="round">
          <h3>${escapeHtml(round.name)}</h3>
          ${round.matches.map(renderMatch).join("")}
        </section>
      `
    )
    .join("");
}

export function setMatchReady({ matchId, opponent }) {
  appState.currentMatch = matchId;
  document.getElementById("match-title").textContent = `You vs ${opponent.name}`;
  document.getElementById("match-status").textContent = "Choose your move.";
  document.getElementById("move-controls").hidden = false;
}

export function setMatchStatus(text, controlsEnabled = true) {
  document.getElementById("match-status").textContent = text;
  document
    .querySelectorAll("#move-controls button")
    .forEach((button) => (button.disabled = !controlsEnabled));
}

export function clearMatch(text = "No active match") {
  appState.currentMatch = null;
  document.getElementById("match-title").textContent = text;
  document.getElementById("match-status").textContent =
    "Wait for your next bracket match.";
  document.getElementById("move-controls").hidden = true;
}

export function addMessage(message) {
  const container = document.getElementById("message-container");
  const element = document.createElement("div");
  element.className = "message";
  element.textContent =
    typeof message === "string" ? message : `${message.senderId}: ${message.text}`;
  container.appendChild(element);
  container.scrollTop = container.scrollHeight;
}

function renderMatch(match) {
  const player1 = match.player1?.name || "TBD";
  const player2 = match.player2?.name || "Bye";
  const winner = match.winner?.name;
  const classes = ["match-card", match.status];

  if (match.tied) classes.push("tied");

  return `
    <article class="${classes.join(" ")}">
      <div>
        <span>${escapeHtml(player1)}</span>
        ${match.player1?.isCpu ? "<em>CPU</em>" : ""}
        ${winner === player1 ? "<strong>Winner</strong>" : ""}
      </div>
      <div>
        <span>${escapeHtml(player2)}</span>
        ${match.player2?.isCpu ? "<em>CPU</em>" : ""}
        ${winner === player2 ? "<strong>Winner</strong>" : ""}
      </div>
      <small>${formatMatchStatus(match)}</small>
    </article>
  `;
}

function formatMatchStatus(match) {
  if (match.status === "bye") return "Bye";
  if (match.status === "complete") return "Complete";
  if (match.tied) return "Tie replay";
  return "Active";
}

function escapeHtml(value) {
  return `${value}`
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
