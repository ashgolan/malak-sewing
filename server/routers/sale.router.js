import { Router } from "express";
import {
  createSale,
  deleteSale,
  getAllSales,
  getSale,
  updateSale,
} from "../controllers/sale.controller.js";

export const saleRouter = Router();
saleRouter.get("/", getAllSales);
saleRouter.get("/:id", getSale);
saleRouter.post("/", createSale);
saleRouter.patch("/", updateSale);
saleRouter.delete("/:id", deleteSale);
