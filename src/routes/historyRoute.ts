// historyRoute.ts
import { Router } from "express";
import { getHistory } from "../controllers/historyController";

const router = Router();

router.get("/:storeId", getHistory);

export default router;
