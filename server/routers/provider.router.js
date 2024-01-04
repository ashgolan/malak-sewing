import { Router } from "express";
import {
  createProvider,
  deleteProvider,
  getAllProviders,
  getProvider,
  updateProvider,
} from "../controllers/provider.controller.js";

export const providerRouter = Router();
providerRouter.get("/", getAllProviders);
providerRouter.get("/:id", getProvider);
providerRouter.post("/", createProvider);
providerRouter.patch("/:id", updateProvider);
providerRouter.delete("/:id", deleteProvider);
