import { Schema, model } from "mongoose";
const date = new Date().toLocaleDateString();

const saleSchema = new Schema({
  date: { type: String, default: date },
  clientName: { type: String, required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  Discount: { type: Number, default: 0 },
  setupPrice: { type: Number, default: 0 },
  haveTax: { type: Boolean, default: false },
});

export const Sale = model("Sale", saleSchema);
