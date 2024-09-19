import { io } from "socket.io-client";
import { displayMessage, addRoomToUI } from "./utils.js";

export const socket = io("http://localhost:3000");

export function setupSocket() {
  socket.on("connect", () => {
    console.log(`Connected with id: ${socket.id}`);
    displayMessage(socket.id);
  });

  socket.on("receive-message", (message) => {
    displayMessage(message);
  });

  socket.on("receive-room", (roomName) => {
    addRoomToUI(roomName);
  });
}
