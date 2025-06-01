// loadTester.service.ts
import { AxiosInstance } from 'axios';

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

export const createLoadTester = (client: AxiosInstance): LoadTestController => {
  let loadInterval: NodeJS.Timeout | null = null;
  let loadTimeout: NodeJS.Timeout | null = null;
  let isLoadRunning = false;

  const startLoadTest = ({
    targetServiceName,
    minRequestsPerSecond = 50,
    maxRequestsPerSecond = 100,
    duration = 60,
  }: LoadTestOptions): boolean => {
    if (isLoadRunning) return false;

    const baseURL = `http://${targetServiceName}:3000/api/auth/health`;
    const startTime = Date.now();

    isLoadRunning = true;

    loadInterval = setInterval(() => {
      const elapsedSeconds = (Date.now() - startTime) / 1000;
      if (elapsedSeconds >= duration) return;

      const normalized = Math.sin((elapsedSeconds / duration) * Math.PI);
      const currentRPS = Math.floor(
        minRequestsPerSecond + normalized * (maxRequestsPerSecond - minRequestsPerSecond)
      );

      for (let i = 0; i < currentRPS; i++) {
        client.get(baseURL).catch((err) => {
          console.error(`[${targetServiceName}] Request failed:`, err.message);
        });
      }

      console.log(`⏱️ ${elapsedSeconds.toFixed(1)}s → ${currentRPS} requests/sec`);
    }, 1000);

    loadTimeout = setTimeout(() => {
      stopLoadTest();
      console.log("✅ Load test auto-stopped after duration.");
    }, duration * 1000);

    return true;
  };

  const stopLoadTest = () => {
    if (loadInterval) clearInterval(loadInterval);
    if (loadTimeout) clearTimeout(loadTimeout);

    loadInterval = null;
    loadTimeout = null;
    isLoadRunning = false;
  };

  const isRunning = () => isLoadRunning;

  return {
    startLoadTest,
    stopLoadTest,
    isRunning,
  };
};
