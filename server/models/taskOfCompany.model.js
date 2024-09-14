import { Schema, model } from "mongoose";

const taskSchema = new Schema({
  description: { type: String, required: true }, // More descriptive field name
});

export const Task = model("Task", taskSchema);
