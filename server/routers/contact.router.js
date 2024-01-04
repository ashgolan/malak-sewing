import { Router } from "express";
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContact,
  updateContact,
} from "../controllers/contact.controllers.js";

export const contactRouter = Router();
contactRouter.get("/", getAllContacts);
contactRouter.get("/:id", getContact);
contactRouter.post("/", createContact);
contactRouter.patch("/:id", updateContact);
contactRouter.delete("/:id", deleteContact);
