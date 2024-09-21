const { instrument } = require("@socket.io/admin-ui");
const io = require("socket.io")(3000, {
  cors: {
    origin: ["http://localhost:8080", "https://admin.socket.io"],
    credentials: true,
  },
});

const rooms = {};

io.on("connection", (socket) => {
  // Track the current room for the socket
  socket.currentRoom = null;

  socket.on("send-message", (message) => {
    socket.broadcast.emit("receive-message", message);
  });

  socket.emit("receive-room", rooms);

  socket.on("create-room", (room) => {
    if (!rooms[room]) {
      rooms[room] = {
        roomName: room,
        players: [],
      };
    }

    console.log(rooms[room]);
    io.emit("receive-room", rooms);
  });

  socket.on("join-room", (room, cb) => {
    if (rooms[room].players.length >= 2) {
      // Room is full, notify the user that they cannot join
      io.to(socket.id).emit("stop-join", () => {
        console.log("Room is full, cannot join");
      });
      return; // Exit early to prevent further execution
    }

    // If room is not full, allow the player to join
    socket.join(room);
    rooms[room].players.push(socket.id);

    // Set the socket's current room
    socket.currentRoom = room;

    console.log(`User ${socket.id} joined room ${room}`);

    // Check if the room is now full (2 players)
    if (rooms[room].players.length === 2) {
      // Room is full, emit the event to start the match
      io.to(room).emit("ready-to-start-match", room);
    }

    io.to(room).emit("waiting-room", rooms[room].players);

    console.log(rooms[room].length);
    console.log(`user ${socket.id} joined room ${room}`);
    cb();
  });

  socket.on("exit-room", (room) => {
    console.log(`User ${socket.id} exited room ${room}`);

    // Remove the player from the room's players list
    rooms[room].players = rooms[room].players.filter((id) => id !== socket.id);

    // Remove the socket's current room reference
    socket.currentRoom = null;

    // Emit the updated room state
    io.to(room).emit("waiting-room", rooms[room].players);
  });

  // Handle disconnect and clean up
  socket.on("disconnect", () => {
    const room = socket.currentRoom;
    if (room) {
      
      // Remove player from the room they were in
      rooms[room].players = rooms[room].players.filter(
        (id) => id !== socket.id
      );

      console.log(`User ${socket.id} disconnected from room ${room}`);
      io.to(room).emit("waiting-room", rooms[room].players);

      // Clear socket's current room
      socket.currentRoom = null;
    }
  });
  
});

instrument(io, { auth: false });
