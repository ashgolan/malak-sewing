import { Inventory } from "../models/inventory.model.js";

export const getAllInventories = async (req, res) => {
  try {
    const inventories = await Inventory.find();
    if (!inventories) throw Error("inventories not found");
    res.send(inventories);
  } catch (e) {
    res.send(e.message);
  }
};
export const getInventory = async (req, res) => {
  const id = req.params.id;
  try {
    const inventory = await Inventory.findById({ _id: id });
    if (!inventory) throw Error("inventory not found");
    res.send(inventory);
  } catch (e) {
    res.send(e.message);
  }
};
export const createInventory = async (req, res) => {
  try {
    const inventory = await Inventory.create(req.body);
    if (!inventory) throw Error("bad data was inserted!");
    res.send(inventory);
  } catch (e) {
    res.send(e.message);
  }
};
export const deleteInventory = async (req, res) => {
  try {
    const product = await Inventory.findByIdAndDelete({ _id: req.params.id });
    if (!product) throw Error("bad data was inserted!");
    res.send(product);
  } catch (e) {
    res.send(e.message);
  }
};
export const updateInventory = async (req, res) => {
  try {
    newProduct = await Inventory.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          ...req.body,
        },
      }
    );

    if (!newProduct) throw Error("bad data was inserted!");
    res.status(200).send(newProduct);
  } catch (e) {
    res.send(e.message);
  }
};
