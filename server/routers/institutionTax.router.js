import { Router } from "express";
import { verifyAccessToken } from "../middleware/verifyAccessToken.js";
import {
  createInstitutionTax,
  deleteInstitutionTax,
  getAllInstitutionTaxes,
  getInstitutionTax,
  updateInstitutionTax,
} from "../controllers/institutionTax.controller.js";

export const InstitutionRouter = Router();
InstitutionRouter.get("/", verifyAccessToken, getAllInstitutionTaxes);
InstitutionRouter.get("/:id", verifyAccessToken, getInstitutionTax);
InstitutionRouter.post("/", verifyAccessToken, createInstitutionTax);
InstitutionRouter.patch("/:id", verifyAccessToken, updateInstitutionTax);
InstitutionRouter.delete("/:id", verifyAccessToken, deleteInstitutionTax);
