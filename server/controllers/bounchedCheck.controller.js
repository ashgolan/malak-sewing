import { BouncedCheck } from "../models/bouncedChecks.model.js";

export const getAllBouncedChecks = async (req, res) => {
  try {
    const bouncedCheck = await BouncedCheck.find();
    if (!bouncedCheck) throw Error("Bounced check not found");
    res.send(bouncedCheck);
  } catch (e) {
    res.send(e.message);
  }
};

export const getBouncedCheck = async (req, res) => {
  const id = req.params.id;
  try {
    const bouncedCheck = await BouncedCheck.findById({ _id: id });
    if (!bouncedCheck) throw Error("Bounced check not found");
    res.send(bouncedCheck);
  } catch (e) {
    res.send(e.message);
  }
};

export const createBouncedCheck = async (req, res) => {
  try {
    const bouncedCheck = await BouncedCheck.create(req.body);
    if (!bouncedCheck) throw Error("Bad data was inserted!");
    res.send(bouncedCheck);
  } catch (e) {
    res.send(e.message);
  }
};

export const deleteBouncedCheck = async (req, res) => {
  try {
    const bouncedCheck = await BouncedCheck.findByIdAndDelete({
      _id: req.params.id,
    });
    if (!bouncedCheck) throw Error("Bad data was inserted!");
    res.send(bouncedCheck);
  } catch (e) {
    res.send(e.message);
  }
};

export const updateBouncedCheck = async (req, res) => {
  try {
    const bouncedCheck = await BouncedCheck.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          ...req.body,
        },
      }
    );
    if (!bouncedCheck) throw Error("Bad data was inserted!");
    res.send(bouncedCheck);
  } catch (e) {
    res.send(e.message);
  }
};
