// src/routes/loadTest.route.ts
import { Request, Response, Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { createLoadTester } from "../services/loadTest.service";

const router = Router();
const loadTester = createLoadTester();

router.post(
  "/start",
  expressAsyncHandler((req:Request, res:Response) => {
    const started = loadTester.startLoadTest(req.body);
    if (!started) {
      res.status(400).json({ message: "Already running" });
      return
    }
    res.json({ message: "Started" });
  })
);

router.get(
  "/stop",
  expressAsyncHandler((_:Request, res:Response) => {
    if (!loadTester.isRunning()){
      res.status(400).json({ message: "Nothing to stop" });
      return 
    }
    loadTester.stopLoadTest();
    res.json({ message: "Stopped" });
  })
);

export default router;
