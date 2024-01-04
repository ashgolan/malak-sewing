import { Router } from "express";
import {
  createInventory,
  deleteInventory,
  getAllInventories,
  getInventory,
  updateInventory,
} from "../controllers/inventory.controller.js";

export const inventoryRouter = Router();
inventoryRouter.get("/", getAllInventories);
inventoryRouter.get("/:id", getInventory);
inventoryRouter.post("/", createInventory);
inventoryRouter.patch("/:id", updateInventory);
inventoryRouter.delete("/:id", deleteInventory);
