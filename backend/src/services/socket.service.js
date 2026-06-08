const { Server } = require("socket.io");

let io;

const initSocket = (server) => {
  const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(",") 
    : ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"];

  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("join:session", (sessionId) => {
      if (!sessionId) {
        console.warn(`Socket ${socket.id} sent invalid sessionId`);
        return;
      }
      socket.join(sessionId);
      socket.emit("session:joined", { sessionId });
      console.log(`Socket ${socket.id} joined session: ${sessionId}`);
    });

    socket.on("leave:session", (sessionId) => {
      if (!sessionId) return;
      socket.leave(sessionId);
      console.log(`Socket ${socket.id} left session: ${sessionId}`);
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error("Socket.IO not initialized");
  return io;
};

module.exports = { initSocket, getIO };