import { Router } from "express";

import { verifyAccessToken } from "../middleware/verifyAccessToken.js";
import {
  createSaleToCompany,
  deleteSaleToCompany,
  getAllSalesToCompanies,
  getSaleToCompany,
  updateSaleToCompany,
} from "../controllers/saleToCompany.controller.js";

export const saleToCompanyRouter = Router();
saleToCompanyRouter.get("/", verifyAccessToken, getAllSalesToCompanies);
saleToCompanyRouter.get("/:id", verifyAccessToken, getSaleToCompany);
saleToCompanyRouter.post("/", verifyAccessToken, createSaleToCompany);
saleToCompanyRouter.patch("/:id", verifyAccessToken, updateSaleToCompany);
saleToCompanyRouter.delete("/:id", verifyAccessToken, deleteSaleToCompany);
