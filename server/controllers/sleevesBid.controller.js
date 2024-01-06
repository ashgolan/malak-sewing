import { SleevesBid } from "../models/sleevesBid.model.js";

export const getAllSleevesBid = async (req, res) => {
  try {
    const sleevesBids = await SleevesBid.find();
    if (!sleevesBids) throw Error("sleevesBids not found");
    res.send(sleevesBids);
  } catch (e) {
    res.send(e.message);
  }
};
export const getSleevesBid = async (req, res) => {
  const id = req.params.id;
  try {
    const sleevesBid = await SleevesBid.findById({ _id: id });
    if (!sleevesBid) throw Error("sleevesBid not found");
    res.send(sleevesBid);
  } catch (e) {
    res.send(e.message);
  }
};
export const createsleevesBid = async (req, res) => {
  try {
    const sleevesBid = await SleevesBid.create(req.body);
    if (!sleevesBid) throw Error("bad data was inserted!");
    res.send(sleevesBid);
  } catch (e) {
    res.send(e.message);
  }
};
export const deleteSleevesBid = async (req, res) => {
  try {
    const sleevesBid = await SleevesBid.findByIdAndDelete({
      _id: req.params.id,
    });
    if (!sleevesBid) throw Error("bad data was inserted!");
    res.send(sleevesBid);
  } catch (e) {
    res.send(e.message);
  }
};
export const updateSleevesBid = async (req, res) => {
  try {
    const sleevesBid = await SleevesBid.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          ...req.body,
        },
      }
    );
    if (!sleevesBid) throw Error("bad data was inserted!");
    res.send(sleevesBid);
  } catch (e) {
    res.send(e.message);
  }
};
