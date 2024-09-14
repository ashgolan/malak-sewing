import { SaleToCompany } from "../models/salesToCompany.model.js";

export const getAllSalesToCompanies = async (req, res) => {
  try {
    const saleToCompany = await SaleToCompany.find();
    if (!saleToCompany) throw Error("sale not found");
    res.send(saleToCompany);
  } catch (e) {
    res.send(e.message);
  }
};
export const getSaleToCompany = async (req, res) => {
  const id = req.params.id;
  try {
    const saleToCompany = await SaleToCompany.findById({ _id: id });
    if (!saleToCompany) throw Error("saleToCompany not found");
    res.send(saleToCompany);
  } catch (e) {
    res.send(e.message);
  }
};
export const createSaleToCompany = async (req, res) => {
  try {
    const saleToCompany = await SaleToCompany.create({
      ...req.body,
      totalAmount: req.body.number,
    });
    if (!saleToCompany) throw Error("bad data was inserted!");
    res.send(saleToCompany);
  } catch (e) {
    res.send(e.message);
  }
};
export const deleteSaleToCompany = async (req, res) => {
  try {
    const saleToCompany = await SaleToCompany.findByIdAndDelete({
      _id: req.params.id,
    });
    if (!saleToCompany) throw Error("bad data was inserted!");
    res.send(saleToCompany);
  } catch (e) {
    res.send(e.message);
  }
};
export const updateSaleToCompany = async (req, res) => {
  try {
    const saleToCompany = await SaleToCompany.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          ...req.body,
        },
      }
    );
    if (!saleToCompany) throw Error("bad data was inserted!");
    res.send(saleToCompany);
  } catch (e) {
    res.send(e.message);
  }
};
