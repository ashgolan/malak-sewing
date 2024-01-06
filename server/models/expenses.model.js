import { Schema, model } from "mongoose";
const date = new Date().toLocaleDateString();

const expenseSchema = new Schema({
  date: { type: String, default: date },
  name: { type: String, required: true },
  number: { type: Number, default: "0" },
  taxPercent: { type: Number, required: true },
  totalAmount: { type: Number },
});

export const Expense = model("Expense", expenseSchema);
