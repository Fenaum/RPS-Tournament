import { socket } from "./socket.js";
import { state } from "./rooms.js"

const { currentRoom } = state

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
    currentRoom = roomName; // Set the current room on join
  });
} 

export function addRoomToUI(roomName) {
  const roomElement = document.createElement("div");
  const roomList = document.getElementById("rooms");

  // Check if a room with the same name already exists
  const existingRoom = roomList.querySelector(
    `.room-name[data-room-name="${roomName}"]`
  );

  if (existingRoom) return;


  roomElement.className = "room-container";
  roomElement.innerHTML = `<div class="room-name" data-room-name="${roomName}">${roomName}</div><button class="join-button">Join</button>`;

  roomList.appendChild(roomElement);

  const joinRoomButton = roomElement.querySelector(".join-button");
  joinRoomButton.addEventListener("click", () => handleJoin(roomName));
}

export function addCurrentPlayersToUI(playersPair) {
  let currentPlayersContainer = document.getElementById(
    "current-players-container"
  );
  currentPlayersContainer.innerHTML = ""; // Clear existing players

  // Create a Set to store unique player IDs
  const playerIds = new Set();

  for (const playerId of playersPair) { 
    if (!playerIds.has(playerId)) {
      let playerElement = document.createElement("h2");
      playerElement.innerText = playerId;

      currentPlayersContainer.appendChild(playerElement);
      playerIds.add(playerId);
    }
  }
}