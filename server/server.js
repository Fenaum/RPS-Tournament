const { instrument } = require("@socket.io/admin-ui");
const { createTournamentManager } = require("./logic/tournament");

const PORT = Number(process.env.PORT) || 3100;

const io = require("socket.io")(PORT, {
  cors: {
    origin: [
      "http://localhost:8080",
      "http://localhost:8081",
      "https://admin.socket.io",
    ],
    credentials: true,
  },
});

const tournamentManager = createTournamentManager(io);

io.on("connection", (socket) => {
  socket.emit("connected", { id: socket.id });
  tournamentManager.emitLobby();

  socket.on("join-queue", (playerName) => {
    tournamentManager.enqueue(socket, playerName);
  });

  socket.on("fill-cpu", () => {
    tournamentManager.fillWithCpu(socket);
  });

  socket.on("leave-queue", () => {
    tournamentManager.leave(socket);
  });

  socket.on("submit-move", (payload) => {
    tournamentManager.submitMove(socket, payload);
  });

  socket.on("send-message", (message) => {
    io.emit("receive-message", {
      senderId: socket.id,
      text: `${message || ""}`.slice(0, 160),
    });
  });

  socket.on("disconnect", () => {
    tournamentManager.leave(socket);
  });
});

instrument(io, { auth: false });

console.log(`RPS tournament websocket server listening on port ${PORT}`);
