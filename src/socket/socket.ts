import { Server } from 'socket.io';
import { chatSocketHandler } from '../socket/chat.socket';

export const configureSockets = (io: Server) => {
  io.on('connection', (socket) => {
    console.log(`🟢 Client connected: ${socket.id}`);
    
    chatSocketHandler(socket);

    socket.on('disconnect', () => {
      console.log(`🔴 Client disconnected: ${socket.id}`);
    });
  });
};