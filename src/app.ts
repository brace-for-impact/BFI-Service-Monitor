import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { configureSockets } from "./socket";
import { setIO } from "./socket/socketService";
import { startKafkaConsumer } from "./kafka";
import { setupRoutes } from "./routes";
import { setupMiddlewares } from "./middlewares";

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: "*" },
});


setIO(io);
setupMiddlewares(app);
setupRoutes(app);
configureSockets(io);
startKafkaConsumer();

export { server };
