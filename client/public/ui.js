// ui.js
import { handleCreateRoom } from "./rooms.js";
import { handleMessage } from "./messages.js";
import { toggleSection } from "./utils.js";

export function setupUI() {
  const createRoomButton = document.getElementById("create-room-button");
  const messageForm = document.getElementById("message-form");
  
  toggleSection('chat-section');
  createRoomButton.addEventListener("click", handleCreateRoom);
  messageForm.addEventListener("submit", handleMessage);
}
