import { Router } from "express";

import { verifyAccessToken } from "../middleware/verifyAccessToken.js";
import {
  createBouncedCheck,
  deleteBouncedCheck,
  getAllBouncedChecks,
  getBouncedCheck,
  updateBouncedCheck,
} from "../controllers/bounchedCheck.controller.js";

export const bouncedCheckRouter = Router();
bouncedCheckRouter.get("/", verifyAccessToken, getAllBouncedChecks);
bouncedCheckRouter.get("/:id", verifyAccessToken, getBouncedCheck);
bouncedCheckRouter.post("/", verifyAccessToken, createBouncedCheck);
bouncedCheckRouter.patch("/:id", verifyAccessToken, updateBouncedCheck);
bouncedCheckRouter.delete("/:id", verifyAccessToken, deleteBouncedCheck);
