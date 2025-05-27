import { Server } from 'socket.io';

let ioInstance: Server | null = null;

export const setIO = (io: Server) => {
  ioInstance = io;
};

export const emitKafkaMessage = (message: string) => {
  if (!ioInstance) {
    console.warn("⚠️ Socket.IO instance not initialized");
    return;
  }

  ioInstance.emit("kafka:message", { message });
};