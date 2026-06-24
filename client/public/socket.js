import {
  addMessage,
  appState,
  clearMatch,
  renderLeaderboard,
  renderQueue,
  renderTournament,
  setConnectionStatus,
  setMatchReady,
  setMatchStatus,
} from "./utils.js";

const SOCKET_URL = window.RPS_SOCKET_URL || "http://localhost:3100";

export const socket = window.io(SOCKET_URL);

export function setupSocket() {
  socket.on("connect", () => {
    setConnectionStatus("Connected", true);
  });

  socket.on("disconnect", () => {
    setConnectionStatus("Disconnected", false);
    setMatchStatus("Connection lost. Reconnect to continue.", false);
  });

  socket.on("connected", ({ id }) => {
    addMessage(`Connected as ${id}`);
  });

  socket.on("player-registered", (player) => {
    appState.player = player;
    document.getElementById("player-name").value = player.name;
  });

  socket.on("queue-update", ({ players, maxPlayers, leaderboard, tournament }) => {
    renderQueue({ players, maxPlayers });
    renderLeaderboard(leaderboard);
    renderTournament(tournament);
  });

  socket.on("queue-error", (message) => {
    document.getElementById("lobby-message").textContent = message;
  });

  socket.on("tournament-started", (tournament) => {
    renderTournament(tournament);
    addMessage("Tournament started.");
  });

  socket.on("tournament-update", (tournament) => {
    renderTournament(tournament);
  });

  socket.on("tournament-complete", (tournament) => {
    renderTournament(tournament);
    clearMatch("Tournament complete");
    addMessage(`Champion: ${tournament.champion.name}`);
  });

  socket.on("match-ready", (payload) => {
    setMatchReady(payload);
  });

  socket.on("move-accepted", ({ choice }) => {
    setMatchStatus(`You chose ${choice}. Waiting for opponent.`, false);
  });

  socket.on("match-update", ({ waitingForOpponent }) => {
    if (waitingForOpponent) return;
    setMatchStatus("Both moves are in. Resolving match.", false);
  });

  socket.on("round-tied", ({ choice }) => {
    setMatchStatus(`Both players chose ${choice}. Choose again.`, true);
  });

  socket.on("match-complete", ({ winner }) => {
    const didWin = winner.id === socket.id;
    clearMatch(didWin ? "You advanced" : "You were eliminated");
  });

  socket.on("move-error", (message) => {
    setMatchStatus(message, true);
  });

  socket.on("receive-message", (message) => {
    addMessage(message);
  });
}
