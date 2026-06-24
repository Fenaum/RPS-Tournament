import { socket } from "./socket.js";
import { addMessage, appState, setMatchStatus } from "./utils.js";

export function setupUI() {
  const queueForm = document.getElementById("queue-form");
  const leaveQueueButton = document.getElementById("leave-queue-button");
  const fillCpuButton = document.getElementById("fill-cpu-button");
  const messageForm = document.getElementById("message-form");
  const moveControls = document.getElementById("move-controls");

  queueForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = document.getElementById("player-name");
    socket.emit("join-queue", input.value);
  });

  leaveQueueButton.addEventListener("click", () => {
    socket.emit("leave-queue");
  });

  fillCpuButton.addEventListener("click", () => {
    socket.emit("fill-cpu");
  });

  messageForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = document.getElementById("message-input");
    const message = input.value.trim();

    if (!message) return;

    socket.emit("send-message", message);
    input.value = "";
  });

  moveControls.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-choice]");
    if (!button || !appState.currentMatch) return;

    setMatchStatus(`Submitting ${button.dataset.choice}.`, false);
    socket.emit("submit-move", { choice: button.dataset.choice });
  });

  addMessage("Enter a display name and join the 20 player queue.");
}
