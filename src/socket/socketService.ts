import { Server } from 'socket.io';

let ioInstance: Server | null = null;

export const setIO = (io: Server) => {
  ioInstance = io;
};

export const sendSocketMessage = (message: string) => {
  if (!ioInstance) {
    console.warn("⚠️ Socket.IO instance not initialized");
    return;
  }
  console.log('sending message to socket\n\n\n\n\n\n');
  

  ioInstance.emit("kafka:message", { message });
};