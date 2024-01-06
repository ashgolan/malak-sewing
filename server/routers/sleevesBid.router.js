import { Router } from "express";
import {
  createsleevesBid,
  deleteSleevesBid,
  getAllSleevesBid,
  getSleevesBid,
  updateSleevesBid,
} from "../controllers/sleevesBid.controller.js";

export const sleevesBidRouter = Router();
sleevesBidRouter.get("/", getAllSleevesBid);
sleevesBidRouter.get("/:id", getSleevesBid);
sleevesBidRouter.post("/", createsleevesBid);
sleevesBidRouter.patch("/:id", updateSleevesBid);
sleevesBidRouter.delete("/:id", deleteSleevesBid);
