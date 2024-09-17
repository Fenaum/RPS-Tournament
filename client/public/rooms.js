// rooms.js
import { socket } from "./socket.js";
import { displayMessage, toggleSection } from "./utils.js"; 

const roomSection = document.getElementById('room-details-section')

export function handleCreateRoom(event) {
  event.preventDefault();
  const roomInput = document.getElementById("room-input");

  if (roomInput.value === "") return;

  const roomElement = document.createElement("div");
  roomElement.className = "room-container";
  roomElement.innerHTML = `<div class="room-name">${roomInput.value}</div><button class="join-button">Join</button>`;

  const roomList = document.getElementById("rooms");
  roomList.appendChild(roomElement);

  // Attach event listener for joining
  const joinButton = roomElement.querySelector(".join-button");
  joinButton.addEventListener("click", handleJoin);

  // Clear input field after adding the room
  roomInput.value = "";
}

function handleJoin(event) {
  event.preventDefault();

  const joinButton = event.target.closest(".join-button");
  if (!joinButton) {
    console.error("Join button not found.");
    return;
  }

  const roomContainer = joinButton.closest(".room-container");
  if (!roomContainer) {
    console.error("Room container not found.");
    return;
  }

  const roomNameElement = roomContainer.querySelector(".room-name");
  if (!roomNameElement) {
    console.error("Room name element not found.");
    return;
  }

  const roomName = roomNameElement.textContent.trim();

  socket.emit("join-room", roomName, (message) => {
    displayMessage(message); // Use the shared function
  });
  
  toggleSection('chat-section')
  toggleSection("room-details-section");
}
