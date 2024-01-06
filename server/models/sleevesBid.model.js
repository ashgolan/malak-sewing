import { Schema, model } from "mongoose";
const date = new Date().toLocaleDateString();

const sleevesBidSchema = new Schema({
  date: { type: String, default: date },
  name: { type: String, required: true },
  number: { type: Number, default: "0" },
  quantity: { type: Number, required: true },
  tax: { type: Boolean, default: false },
  totalAmount: { type: Number },
});

export const SleevesBid = model("SleevesBid", sleevesBidSchema);
