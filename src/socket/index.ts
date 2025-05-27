import { Server } from 'socket.io';
import { chatSocketHandler } from './socketHandler';

export const configureSockets = (io: Server) => {
  io.on('connection', (socket) => {
    console.log(`🟢 Client connected: ${socket.id}`);

    chatSocketHandler(socket); // Handle chat-related events

    socket.on('disconnect', () => {
      console.log(`🔴 Client disconnected: ${socket.id}`);
    });
  });
};
