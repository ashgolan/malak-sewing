import { Router } from "express";
import {
  createInventory,
  deleteInventory,
  getAllInventories,
  getInventory,
  updateInventory,
} from "../controllers/inventory.controller.js";
import { verifyAccessToken } from "../middleware/verifyAccessToken.js";

export const inventoryRouter = Router();
inventoryRouter.get("/", verifyAccessToken, getAllInventories);
inventoryRouter.get("/:id", verifyAccessToken, getInventory);
inventoryRouter.post("/", verifyAccessToken, createInventory);
inventoryRouter.patch("/:id", verifyAccessToken, updateInventory);
inventoryRouter.delete("/:id", verifyAccessToken, deleteInventory);
