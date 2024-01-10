import { WorkerExpenses } from "../models/workersExpenses.model.js";

export const getAllWorkersExpenses = async (req, res) => {
  try {
    const workersExpenses = await WorkerExpenses.find();
    if (!workersExpenses) throw Error("workersExpenses not found");
    res.send(workersExpenses);
  } catch (e) {
    res.send(e.workersExpenses);
  }
};
export const getWorkerExpense = async (req, res) => {
  const id = req.params.id;
  try {
    const workerExpense = await WorkerExpenses.findById({ _id: id });
    if (!workerExpense) throw Error("workerExpense not found");
    res.send(workerExpense);
  } catch (e) {
    res.send(e.message);
  }
};
export const createWorkerExpense = async (req, res) => {
  try {
    const workerExpense = await WorkerExpenses.create(req.body);
    if (!workerExpense) throw Error("bad data was inserted!");
    res.send(workerExpense);
  } catch (e) {
    res.send(e.message);
  }
};
export const deleteWorkerExpense = async (req, res) => {
  try {
    const workerExpense = await WorkerExpenses.findByIdAndDelete({
      _id: req.params.id,
    });
    if (!workerExpense) throw Error("bad data was inserted!");
    res.send(workerExpense);
  } catch (e) {
    res.send(e.message);
  }
};
export const updateWorkerExpense = async (req, res) => {
  try {
    const workerExpense = await WorkerExpenses.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          ...req.body,
        },
      }
    );
    if (!workerExpense) throw Error("bad data was inserted!");
    res.send(workerExpense);
  } catch (e) {
    res.send(e.message);
  }
};
