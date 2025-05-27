import { Server } from "socket.io";

let ioInstance: Server;

export const setIO = (io: Server) => {
  ioInstance = io;
};

export const emitKafkaMessage = (msg: string) => {
  if (!ioInstance) {
    console.error("❌ Socket.IO not initialized");
    return;
  }

  ioInstance.emit("kafka:message", { message: msg });
};
