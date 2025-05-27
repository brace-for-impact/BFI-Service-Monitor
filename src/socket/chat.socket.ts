import { Socket } from "socket.io";

export const chatSocketHandler = (socket: Socket) => {
  socket.on("chat:sendMessage", (message) => {
    console.log(`📨 Message from ${socket.id}:`, message);

    socket.broadcast.emit("chat:newMessage", {
      sender: socket.id,
      text: message,
    });
  });
};
