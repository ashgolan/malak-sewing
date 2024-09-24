import { TaxValues } from "../models/taxValues.model.js";

export const getAllTaxValues = async (req, res) => {
  try {
    const taxValues = await TaxValues.find();
    if (!taxValues) throw Error("taxValues not found");
    res.send(taxValues);
  } catch (e) {
    res.send(e.message);
  }
};
export const createTaxValues = async (req, res) => {
  try {
    const taxValues = await TaxValues.create(req.body);
    if (!taxValues) throw Error("bad data was inserted!");
    res.send(taxValues);
  } catch (e) {
    res.send(e.message);
  }
};
export const deleteTaxValues = async (req, res) => {
  try {
    const taxValues = await TaxValues.findByIdAndDelete({
      _id: req.params.id,
    });
    if (!taxValues) throw Error("bad data was inserted!");
    res.send(taxValues);
  } catch (e) {
    res.send(e.message);
  }
};
export const updateTaxValues = async (req, res) => {
  try {
    const taxValues = await TaxValues.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          ...req.body,
        },
      }
    );
    if (!taxValues) throw Error("bad data was inserted!");
    res.send(taxValues);
  } catch (e) {
    res.send(e.message);
  }
};
