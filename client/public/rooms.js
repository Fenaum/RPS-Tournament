import { socket } from "./socket.js";
import { addRoomToUI } from "./utils.js";

export function handleCreateRoom(event) {
  event.preventDefault();
  const roomInput = document.getElementById("room-input");

  if (roomInput.value === "") return;

  let roomName = roomInput.value;

  socket.emit("create-room", roomName);
  addRoomToUI(roomName);

  roomInput.value = "";
}
