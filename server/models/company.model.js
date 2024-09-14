import { Schema, model } from "mongoose";
import { Task } from "./taskOfCompany.model.js";

const companyWithTask = new Schema({
  name: { type: String, required: true },
  tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }], // Array of task references
});

export const CompanyWithTask = model("CompanyWithTask", companyWithTask);
