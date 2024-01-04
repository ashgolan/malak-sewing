import { Contact } from "../models/contact.model.js";

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    if (!contacts) throw Error("contacts not found");
    res.send(contacts);
  } catch (e) {
    res.send(e.message);
  }
};
export const getContact = async (req, res) => {
  const id = req.params.id;
  try {
    const contact = await Contact.findById({ _id: id });
    if (!contact) throw Error("contact not found");
    res.send(contact);
  } catch (e) {
    res.send(e.message);
  }
};
export const createContact = async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    if (!contact) throw Error("bad data was inserted!");
    res.send(contact);
  } catch (e) {
    res.send(e.message);
  }
};
export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete({ _id: req.params.id });
    if (!contact) throw Error("bad data was inserted!");
    res.send(contact);
  } catch (e) {
    res.send(e.message);
  }
};
export const updateContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          ...req.body,
        },
      }
    );
    if (!contact) throw Error("bad data was inserted!");
    res.send(contact);
  } catch (e) {
    res.send(e.message);
  }
};
