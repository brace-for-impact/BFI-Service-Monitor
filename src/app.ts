
import express, { Request, Response } from "express"
import shared from "@brace-for-impact/bfi-shared"
import expressAsyncHandler from "express-async-handler"
import { config } from "./config"
const app=express()

app.use(express.json())
app.use(shared.middlewares.apiLogger({
    logHttpMethod: true,
    logRequestUrl: true,
    logRequestBody: true,
    logResponseTime: true,
    logStatusCode: true,
  }))


let loadInterval: NodeJS.Timeout | null = null;
let loadTimeout: NodeJS.Timeout | null = null;
let isLoadRunning = false;

app.get('/stop', async(req:Request, res:Response) => {
  if (!isLoadRunning || !loadInterval) {
   res.status(400).json({ message: 'No active load to stop' });
   return
  }

  clearInterval(loadInterval!);
  isLoadRunning = false;
  res.json({ message: 'Load stopped' });
});


app.post("/api/monitor/health", (req: Request, res: Response) => {
  const {
    targetServiceName,
    minRequestsPerSecond = 50,
    maxRequestsPerSecond = 100,
    duration = 60, // in seconds
  } = req.body;

  const baseURL = `http://${targetServiceName}:3000/api/health`
  const client = config.axios;

  if (isLoadRunning) {
     res.status(400).json({ message: "Load test already in progress" });
     return
  }

  isLoadRunning = true;
  res.json({ message: "Sine wave load started" });

  const startTime = Date.now();

  loadInterval = setInterval(() => {
    const elapsedSeconds = (Date.now() - startTime) / 1000;
    if (elapsedSeconds >= duration) return;

    const normalized = Math.sin((elapsedSeconds / duration) * Math.PI); // 0 to 1 to 0
    const currentRPS = Math.floor(
      minRequestsPerSecond +
      normalized * (maxRequestsPerSecond - minRequestsPerSecond)
    );

    for (let i = 0; i < currentRPS; i++) {
      client.get(baseURL).catch((err) => {
        console.error(`[${targetServiceName}] Request failed:`, err.message);
      });
    }

    console.log(`⏱️ ${elapsedSeconds.toFixed(1)}s → ${currentRPS} requests/sec`);
  }, 1000);

  loadTimeout = setTimeout(() => {
    if (loadInterval) clearInterval(loadInterval);
    isLoadRunning = false;
    loadInterval = null;
    console.log("✅ Load test auto-stopped after duration.");
  }, duration * 1000);

   res;
});



app.all("/api/health", expressAsyncHandler((req, res, next)=>{
    res.status(200).json({status:true,message:"Monitor service is healthy"})
}))



app.use(shared.middlewares.errorHandler)

export default app