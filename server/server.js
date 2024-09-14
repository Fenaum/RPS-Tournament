const express = require("express");
const http = require("http");
const WebSocket = require("ws");
// const { createTournament } = require("./logic/tournament"); // Import tournament logic

// Create an Express application
const app = express();

// Create an HTTP server
const server = http.createServer(app);

// Create a WebSocket server
const wss = new WebSocket.Server({ server });

// Store ongoing tournaments and games
const tournaments = {}; // In-memory storage for tournaments

// Handle WebSocket connections
wss.on("connection", (ws) => {
  console.log("New player connected");

  ws.on("message", (message) => {
    const playerData = JSON.parse(message);
    console.log(`Player ${playerData.username} chose ${playerData.move}`);

    // You can implement game logic here
    // Broadcast the move to other players or respond to the player

    ws.send(`Move received: ${playerData.move}`);
  });

  ws.on("close", () => {
    console.log("Player disconnected");
  });
});


// Serve static files from the 'public' directory
app.use(express.static("public"));

// Start the server
server.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
