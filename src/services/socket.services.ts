import express, {Express} from 'express';
import http from "http";
import { Server as SocketIOServer } from "socket.io";

let io: SocketIOServer | null = null;
let app: Express | null = express()
let server: http.Server | null = null;

export const socketExpressServerInit = async () => {
  app = express();
  server = http.createServer(app);
  io = new SocketIOServer(server, {
    cors: { origin: "*" },
  });
  return { app, server, io };
}

export const getSocketExpressServer = () => {
    if (!app || !server || !io) {
        throw new Error("Socket.IO server is not initialized. Please call socketExpressServerInit first.");
    }
    return { app, server, io };
};