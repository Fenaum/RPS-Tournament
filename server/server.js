const { instrument } = require("@socket.io/admin-ui");
const io = require("socket.io")(3000, {
  cors: {
    origin: ["http://localhost:8080", "https://admin.socket.io"],
    credentials: true,
  },
});

const rooms = {};

io.on("connection", (socket) => {
  socket.on('send-message', (message) => {
    socket.broadcast.emit('receive-message', message)
  })

  socket.on('create-room', (room) => {
    socket.broadcast.emit('receive-room', room)
  })

  socket.on("join-room", (room, cb) => {
    // if (room.trim() === "") {
    //   socket.emit('error', 'Please enter a valid room name');
    //   return;
    // }
    
    socket.join(room);
    
    // if (!room[room]) {
    //   rooms[room] = []
    // }

    // rooms[room].push(socket.id)

    // if (room[room].length === 2) {
    //   io.to(room).emit('Ready to start match', rooms[room])
    // }
    console.log(`user ${socket.id} joined room ${room}`)
    cb();
  });
});

instrument(io, { auth: false });
