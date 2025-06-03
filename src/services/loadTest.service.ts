// src/services/loadTester.service.ts
import { Worker } from "worker_threads";
import path from "path";

interface LoadTestOptions {
  targetServiceName: string;
  minRequestsPerSecond?: number;
  maxRequestsPerSecond?: number;
  duration?: number;
}

interface LoadTestController {
  startLoadTest: (options: LoadTestOptions) => boolean;
  stopLoadTest: () => void;
  isRunning: () => boolean;
}

export const createLoadTester = (): LoadTestController => {
  let worker: Worker | null = null;

  const startLoadTest = (options: LoadTestOptions): boolean => {
    console.log('starting load test\n\n\n\n\n\n\n');
    
    if (worker) return false;

    const workerPath = path.resolve(__dirname,"../../dist/workers/loadTesterWorker.js");

    worker = new Worker(workerPath);
    worker.postMessage(options);

    worker.on("message", (msg) => {
      if (msg.status === "done") {
        console.log("✅ Load test completed.");
        stopLoadTest();
      }
    });

    worker.on("error", (err) => {
      console.error("❌ Worker error:", err);
      stopLoadTest();
    });

    return true;
  };

  const stopLoadTest = () => {
    if (worker) {
      worker.terminate();
      worker = null;
    }
  };

  const isRunning = () => worker !== null;

  return { startLoadTest, stopLoadTest, isRunning };
};
