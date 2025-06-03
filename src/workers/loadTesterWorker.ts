import { parentPort } from "worker_threads";
import axios from "axios";

interface LoadTestOptions {
  targetServiceName: string;
  minRequestsPerSecond?: number;
  maxRequestsPerSecond?: number;
  duration?: number;
}

if (!parentPort) throw new Error("Must be run as a worker");

parentPort.on("message", async (options: LoadTestOptions) => {
  const {
    targetServiceName,
    minRequestsPerSecond = 50,
    maxRequestsPerSecond = 100,
    duration = 60,
  } = options;

  const baseURL = `http://${targetServiceName}:3000/api/auth/health`;
  const startTime = Date.now();

  const interval = setInterval(() => {
    const elapsedSeconds = (Date.now() - startTime) / 1000;
    if (elapsedSeconds >= duration) return;

    const normalized = Math.sin((elapsedSeconds / duration) * Math.PI);
    const currentRPS = Math.floor(
      minRequestsPerSecond + normalized * (maxRequestsPerSecond - minRequestsPerSecond)
    );

    for (let i = 0; i < currentRPS; i++) {
      axios.get(baseURL).catch(() => {}); // Fire-and-forget
    }

    console.log(`⏱️ ${elapsedSeconds.toFixed(1)}s → ${currentRPS} requests/sec`);
  }, 1000);

  setTimeout(() => {
    clearInterval(interval);
    parentPort?.postMessage({ status: "done" });
  }, duration * 1000);
});
