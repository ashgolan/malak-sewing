import { Router } from "express";
import { verifyAccessToken } from "../middleware/verifyAccessToken.js";
import {
  createTaxValues,
  deleteTaxValues,
  getAllTaxValues,
  updateTaxValues,
} from "../controllers/taxValues.controller.js";

export const taxValuesRouter = Router();
taxValuesRouter.get("/", verifyAccessToken, getAllTaxValues);
// taxValuesRouter.get("/:id", verifyAccessToken, getAllTaxValues);
taxValuesRouter.post("/", verifyAccessToken, createTaxValues);
taxValuesRouter.patch("/:id", verifyAccessToken, updateTaxValues);
taxValuesRouter.delete("/:id", verifyAccessToken, deleteTaxValues);
