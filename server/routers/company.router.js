import { Router } from "express";
import {
  addTask,
  createCompanyWithTask,
  deleteCompany,
  deleteTask,
  getAllCompanies,
  getCompany,
  getTask,
  updateCompany,
  updateTask,
} from "../controllers/company.controller.js";
import { verifyAccessToken } from "../middleware/verifyAccessToken.js";

export const companyRouter = Router();
companyRouter.get("/", verifyAccessToken, getAllCompanies);
companyRouter.get("/:id", verifyAccessToken, getCompany);
companyRouter.get("/task/:id", verifyAccessToken, getTask);
companyRouter.post("/", verifyAccessToken, createCompanyWithTask);
companyRouter.post("/task/:id", verifyAccessToken, addTask);
companyRouter.put("/:id", verifyAccessToken, updateCompany);
companyRouter.put("/task/:id", verifyAccessToken, updateTask);
companyRouter.delete("/task/:id", verifyAccessToken, deleteTask);
companyRouter.delete("/:id", verifyAccessToken, deleteCompany);
