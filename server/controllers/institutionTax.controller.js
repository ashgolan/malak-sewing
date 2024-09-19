import { InstitutionTax } from "../models/institutionTax.model.js";

export const getAllInstitutionTaxes = async (req, res) => {
  try {
    const institutionTax = await InstitutionTax.find();
    if (!institutionTax) throw Error("institutionTax not found");
    res.send(institutionTax);
  } catch (e) {
    res.send(e.message);
  }
};
export const getInstitutionTax = async (req, res) => {
  const id = req.params.id;
  try {
    const institutionTax = await InstitutionTax.findById({ _id: id });
    if (!institutionTax) throw Error("institutionTax not found");
    res.send(institutionTax);
  } catch (e) {
    res.send(e.message);
  }
};
export const createInstitutionTax = async (req, res) => {
  try {
    const institutionTax = await InstitutionTax.create(req.body);
    if (!institutionTax) throw Error("bad data was inserted!");
    res.send(institutionTax);
  } catch (e) {
    res.send(e.message);
  }
};
export const deleteInstitutionTax = async (req, res) => {
  try {
    const institutionTax = await InstitutionTax.findByIdAndDelete({
      _id: req.params.id,
    });
    if (!sale) throw Error("bad data was inserted!");
    res.send(institutionTax);
  } catch (e) {
    res.send(e.message);
  }
};
export const updateInstitutionTax = async (req, res) => {
  try {
    const institutionTax = await InstitutionTax.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          ...req.body,
        },
      }
    );
    if (!institutionTax) throw Error("bad data was inserted!");
    res.send(institutionTax);
  } catch (e) {
    res.send(e.message);
  }
};
