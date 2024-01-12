import { Router } from "express";
import {
  createBid,
  deleteBid,
  getAllBids,
  getBid,
  updateBid,
} from "../controllers/bid.controller.js";
import { verifyAccessToken } from "../middleware/verifyAccessToken.js";
export const bidRouter = Router();

bidRouter.get("/", verifyAccessToken, getAllBids);
bidRouter.get("/:id", verifyAccessToken, getBid);
bidRouter.post("/", verifyAccessToken, createBid);
bidRouter.patch("/", verifyAccessToken, updateBid);
bidRouter.delete("/:id", verifyAccessToken, deleteBid);
