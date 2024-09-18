import { socket } from "./socket.js";

export function displayMessage(message) {
  const messageDiv = document.createElement("div");
  messageDiv.className = "message";
  messageDiv.textContent = message;

  const messageContainer = document.getElementById("message-container");
  messageContainer.appendChild(messageDiv);
}

export function toggleSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.classList.toggle("hidden");
  }
}

export function handleJoin(roomName) {
  socket.emit("join-room", roomName, () => {
    console.log(`Joined room: ${roomName}`);
    toggleSection("chat-section");
    toggleSection("room-details-section");
  });
}

export function addRoomToUI(roomName) {
  const roomElement = document.createElement("div");
  roomElement.className = "room-container";
  roomElement.innerHTML = `<div class="room-name">${roomName}</div><button class="join-button">Join</button>`;

  const roomList = document.getElementById("rooms");
  roomList.appendChild(roomElement);

  const joinRoomButton = roomElement.querySelector(".join-button");
  joinRoomButton.addEventListener("click", () => handleJoin(roomName));
}
