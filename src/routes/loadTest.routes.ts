import { Request, Response, Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { createLoadTester } from "../services/loadTest.service";
import { config } from "../config";

const router = Router();
const loadTester = createLoadTester(config.axios);

router.post(
  "/start",
  expressAsyncHandler((req: Request, res: Response) => {
    const success = loadTester.startLoadTest(req.body);
    if (!success) {
      res.status(400).json({ message: "Already running" });
      return;
    }
    res.json({ message: "Started" });
  })
);

router.get(
  "/stop",
  expressAsyncHandler((req: Request, res: Response) => {
    if (!loadTester.isRunning()) {
      res.status(400).json({ message: "Nothing to stop" });
      return;
    }

    loadTester.stopLoadTest();
    res.json({ message: "Stopped" });
  })
);

export default router;
