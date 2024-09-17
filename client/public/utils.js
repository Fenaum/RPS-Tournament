// utils.js

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