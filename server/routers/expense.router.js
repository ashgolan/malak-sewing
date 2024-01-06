import { Router } from "express";
import {
  createExpense,
  deleteExpense,
  getAllExpenses,
  getExpense,
  updateExpense,
} from "../controllers/expense.controller.js";

export const expenseRouter = Router();
expenseRouter.get("/", getAllExpenses);
expenseRouter.get("/:id", getExpense);
expenseRouter.post("/", createExpense);
expenseRouter.patch("/:id", updateExpense);
expenseRouter.delete("/:id", deleteExpense);
