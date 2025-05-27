import express, { Request, Response } from "express";
import shared from "@brace-for-impact/bfi-shared";
import expressAsyncHandler from "express-async-handler";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { configureSockets } from "./socket";
import { setIO, emitKafkaMessage } from "./socket/socketService";
import { config } from "./config";
import { createLoadTester } from "./services/loadTest.service";
import { startKafkaConsumer } from "./kafka";
import { setupRoutes } from "./routes";

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: "*" },
});

// setIO(io);

// app.use(express.json());

app.use(
  shared.middlewares.apiLogger({
    logHttpMethod: true,
    logRequestUrl: true,
    logRequestBody: true,
    logResponseTime: true,
    logStatusCode: true,
  })
);

// const loadTester = createLoadTester(config.axios);
// app.post(
//   "/api/monitor/health",
//   expressAsyncHandler((req: Request, res: Response) => {
//     const success = loadTester.startLoadTest(req.body);
//     if (!success) {
//       res.status(400).json({ message: "Load test already in progress" });
//       return;
//     }

//     res.json({ message: "Sine wave load started" });
//     return;
//   })
// );

// app.get(
//   "/stop",
//   expressAsyncHandler((req: Request, res: Response) => {
//     if (!loadTester.isRunning()) {
//       res.status(400).json({ message: "No active load to stop" });
//       return;
//     }

//     loadTester.stopLoadTest();
//     res.json({ message: "Load stopped" });
//     return;
//   })
// );

// app.all(
//   "/api/health",
//   expressAsyncHandler((req, res) => {
//     res
//       .status(200)
//       .json({ status: true, message: "Monitor service is healthy" });
//   })
// );

setIO(io);
// setupMiddlewares(app);
setupRoutes(app);
configureSockets(io);
startKafkaConsumer();

app.use(shared.middlewares.errorHandler);
export { server };
