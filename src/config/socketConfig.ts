// socketConfig.ts
import { Server, Socket } from "socket.io";
import http from "http";

const setupSocketIO = (server: http.Server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log("a user connected");

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });

    socket.on("message", (msg: string) => {
      console.log("message: " + msg);
      socket.emit("message", `Received: ${msg}`);
    });
  });

  return io;
};

export default setupSocketIO;
