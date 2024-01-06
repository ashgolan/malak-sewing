import { Router } from "express";
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContact,
  updateContact,
} from "../controllers/contact.controllers.js";
import { verifyAccessToken } from "../middleware/verifyAccessToken.js";

export const contactRouter = Router();
contactRouter.get("/", verifyAccessToken, getAllContacts);
contactRouter.get("/:id", verifyAccessToken, getContact);
contactRouter.post("/", verifyAccessToken, createContact);
contactRouter.patch("/:id", verifyAccessToken, updateContact);
contactRouter.delete("/:id", verifyAccessToken, deleteContact);
