// messages.js
import { socket } from "./socket.js";
import { displayMessage } from "./utils.js";

export function handleMessage(event) {
  event.preventDefault();

  const messageInput = document.getElementById("message-input");
  let message = messageInput.value;
  if (message === "") return;

  displayMessage(message);
  socket.emit("sendMessage", message);

  messageInput.value = "";
}
