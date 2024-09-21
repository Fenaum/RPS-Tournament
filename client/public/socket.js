import { io } from "socket.io-client";
import { displayMessage, addRoomToUI, addCurrentPlayersToUI } from "./utils.js";

export const socket = io("http://localhost:3000");

export function setupSocket() {
  socket.on("connect", () => {
    console.log(`Connected with id: ${socket.id}`);
    displayMessage(socket.id);
  });

  socket.on("receive-room", (rooms) => {
    console.log(rooms)
    for (const room in rooms) {
      if (rooms.hasOwnProperty(room)) {
        addRoomToUI(rooms[room].roomName);
      }
    }
  });

  socket.on("receive-message", (message) => {
    displayMessage(message);
  });


  socket.on('ready-to-start-match', (room) =>{
    console.log(`${room} ready to start match`)
  })

  socket.on('waiting-room', (playerPair) => {
    addCurrentPlayersToUI(playerPair)
  })

}
