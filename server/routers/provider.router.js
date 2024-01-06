import { Router } from "express";
import {
  createProvider,
  deleteProvider,
  getAllProviders,
  getProvider,
  updateProvider,
} from "../controllers/provider.controller.js";
import { verifyAccessToken } from "../middleware/verifyAccessToken.js";

export const providerRouter = Router();
providerRouter.get("/", verifyAccessToken, getAllProviders);
providerRouter.get("/:id", verifyAccessToken, getProvider);
providerRouter.post("/", verifyAccessToken, createProvider);
providerRouter.patch("/:id", verifyAccessToken, updateProvider);
providerRouter.delete("/:id", verifyAccessToken, deleteProvider);
