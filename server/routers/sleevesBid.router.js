import { Router } from "express";
import {
  createsleevesBid,
  deleteSleevesBid,
  getAllSleevesBid,
  getSleevesBid,
  updateSleevesBid,
} from "../controllers/sleevesBid.controller.js";
import { verifyAccessToken } from "../middleware/verifyAccessToken.js";

export const sleevesBidRouter = Router();
sleevesBidRouter.get("/", verifyAccessToken, getAllSleevesBid);
sleevesBidRouter.get("/:id", verifyAccessToken, getSleevesBid);
sleevesBidRouter.post("/", verifyAccessToken, createsleevesBid);
sleevesBidRouter.patch("/:id", verifyAccessToken, updateSleevesBid);
sleevesBidRouter.delete("/:id", verifyAccessToken, deleteSleevesBid);
