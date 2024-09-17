import { io } from "socket.io-client";

const roomList = document.getElementById("rooms");
const roomInput = document.getElementById("room-input");
const createRoomButton = document.getElementById("create-room-button");
const joinButton = document.getElementById("join-button");
const messageContainer = document.getElementById("message-container");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");
const socket = io("http://localhost:3000");

socket.on("connect", () => {
  displayMessage(`you connencted with id: ${socket.id}`);
});

socket.on("receiveMessage", (message) => {
  displayMessage(message);
});

// Display message
function displayMessage(message) {
  const messageDiv = document.createElement("div");
  messageDiv.className = "message"; // Add the class 'message'

  messageDiv.textContent = message;
  messageContainer.appendChild(messageDiv);
}

function handleMessage(event) {
  event.preventDefault();
  let message = messageInput.value;
  if (message === "") return;

  displayMessage(message);
  socket.emit("sendMessage", message);

  messageInput.value = "";
}

function handleCreateRoom(event) {
  event.preventDefault();
  if (roomInput.value === "") return;

  const roomElement = document.createElement("div");
  roomElement.className = "room-container";
  roomElement.innerHTML = `<div class="room-name">${roomInput.value}</div><button class="join-button">Join</button>`;

  roomList.appendChild(roomElement);

  // Attach event listener for joining
  const joinButton = roomElement.querySelector(".join-button");
  joinButton.addEventListener("click", handleJoin);

  // Clear input field after adding the room
  roomInput.value = "";
}

function handleJoin(event) {
  event.preventDefault();

  // Get the clicked button
  const joinButton = event.target.closest(".join-button");

  // Check if joinButton is found
  if (!joinButton) {
    console.error("Join button not found.");
    return;
  }

  // Find the room container element
  const roomContainer = joinButton.closest(".room-container");

  // Check if roomContainer is found
  if (!roomContainer) {
    console.error("Room container not found.");
    return;
  }

  // Get the room name from the room-container
  const roomNameElement = roomContainer.querySelector(".room-name");

  // Check if roomNameElement is found
  if (!roomNameElement) {
    console.error("Room name element not found.");
    return;
  }

  const roomName = roomNameElement.textContent.trim();

  // Emit the event to join the room
  socket.emit("join-room", roomName, (message) => {
    displayMessage(message);
  });
}

messageForm.addEventListener("click", handleMessage);
createRoomButton.addEventListener("click", handleCreateRoom);
