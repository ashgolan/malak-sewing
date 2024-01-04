import { Provider } from "../models/provider.model.js";

export const getAllProviders = async (req, res) => {
  try {
    const providers = await Provider.find();
    if (!providers) throw Error("providers not found");
    res.send(providers);
  } catch (e) {
    res.send(e.message);
  }
};
export const getProvider = async (req, res) => {
  const id = req.params.id;
  try {
    const provider = await Provider.findById({ _id: id });
    if (!provider) throw Error("provider not found");
    res.send(provider);
  } catch (e) {
    res.send(e.message);
  }
};
export const createProvider = async (req, res) => {
  try {
    const provider = await Provider.create(req.body);
    if (!provider) throw Error("bad data was inserted!");
    res.send(provider);
  } catch (e) {
    res.send(e.message);
  }
};
export const deleteProvider = async (req, res) => {
  try {
    const provider = await Provider.findByIdAndDelete({ _id: req.params.id });
    if (!provider) throw Error("bad data was inserted!");
    res.send(provider);
  } catch (e) {
    res.send(e.message);
  }
};
export const updateProvider = async (req, res) => {
  try {
    const provider = await Provider.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          ...req.body,
        },
      }
    );

    if (!provider) throw Error("bad data was inserted!");
    res.send(provider);
  } catch (e) {
    res.send(e.message);
  }
};
