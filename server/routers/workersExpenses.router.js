import { Router } from "express";
import {
  createWorkerExpense,
  deleteWorkerExpense,
  getAllWorkersExpenses,
  getWorkerExpense,
  updateWorkerExpense,
} from "../controllers/workersExpenses.controller.js";
import { verifyAccessToken } from "../middleware/verifyAccessToken.js";

export const workersExpensesRouter = Router();
workersExpensesRouter.get("/", verifyAccessToken, getAllWorkersExpenses);
workersExpensesRouter.get("/:id", verifyAccessToken, getWorkerExpense);
workersExpensesRouter.post("/", verifyAccessToken, createWorkerExpense);
workersExpensesRouter.patch("/:id", verifyAccessToken, updateWorkerExpense);
workersExpensesRouter.delete("/:id", verifyAccessToken, deleteWorkerExpense);
