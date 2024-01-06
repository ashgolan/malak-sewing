import { Schema, model } from "mongoose";
const date = new Date().toLocaleDateString();

const saleSchema = new Schema({
  date: { type: String, default: date },
  clientName: { type: String, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  number: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  sale: { type: Number, default: 0 },
  setupPrice: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  tax: { type: Boolean, default: false },
});

export const Sale = model("Sale", saleSchema);
