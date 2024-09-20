import { CompanyWithTask } from "../models/company.model.js";
import { Task } from "../models/taskOfCompany.model.js";

export const createCompanyWithTask = async (req, res) => {
  try {
    const { name, isInstitution, taskDescription } = req.body;

    const task = await Task.create({ description: taskDescription });

    const company = await CompanyWithTask.create({
      name,
      isInstitution,
      tasks: [task],
    });

    res.status(201).json({ message: "Company created successfully", company });
  } catch (error) {
    res.status(500).json({ message: "Error creating company", error });
  }
};
export const addTask = async (req, res) => {
  try {
    const companyId = req.params.id; // Get company ID from URL
    const { newDescription } = req.body; // Get the new task description from the request body

    // Create the new task
    const newTask = new Task({ description: newDescription });
    await newTask.save();

    // Find the company and update by adding the new task's ID to the tasks array
    const updatedCompany = await CompanyWithTask.findByIdAndUpdate(
      { _id: companyId },
      { $push: { tasks: newTask._id } }, // Add the new task ID to the tasks array
      { new: true } // Return the updated document
    ).populate("tasks"); // Optionally, populate the tasks array to return the updated company with the tasks

    if (!updatedCompany) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json({
      message: "Task added successfully to the company",
      updatedCompany,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding task to the company", error });
  }
};

export const updateTask = async (req, res) => {
  try {
    const companyId = req.params.id;
    const { newDescription } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      { _id: companyId },
      { description: newDescription },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task updated successfully", updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id; // Get the task ID from the URL

    // Find the task by ID and delete it
    const deletedTask = await Task.findByIdAndDelete({ _id: taskId });

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully", deletedTask });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error });
  }
};

export const getAllCompanies = async (req, res) => {
  try {
    // Find all companies and populate their tasks
    const companies = await CompanyWithTask.find().populate("tasks");

    res.status(200).json({ companies });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching companies and tasks", error });
  }
};
export const getCompany = async (req, res) => {
  try {
    const companyId = req.params.id; // Get company ID from URL

    // Find the company by ID and populate its tasks
    const company = await CompanyWithTask.findById({ _id: companyId }).populate(
      "tasks"
    );

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json({ company });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching company and tasks", error });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const companyId = req.params.id; // Get company ID from URL
    const { name, isInstitution } = req.body; // Get the new company name from request body

    // Find the company by ID and update its name
    const updatedCompany = await CompanyWithTask.findByIdAndUpdate(
      { _id: companyId },
      { name, isInstitution }, // Update the company name
      { new: true } // Return the updated document
    );

    if (!updatedCompany) {
      return res.status(404).json({ message: "Company not found" });
    }

    res
      .status(200)
      .json({ message: "Company updated successfully", updatedCompany });
  } catch (error) {
    res.status(500).json({ message: "Error updating company", error });
  }
};
export const deleteCompany = async (req, res) => {
  try {
    const companyId = req.params.id; // Get company ID from URL

    // Find and delete the company by ID
    const deletedCompany = await CompanyWithTask.findByIdAndDelete({
      _id: companyId,
    });

    if (!deletedCompany) {
      return res.status(404).json({ message: "Company not found" });
    }

    res
      .status(200)
      .json({ message: "Company deleted successfully", deletedCompany });
  } catch (error) {
    res.status(500).json({ message: "Error deleting company", error });
  }
};

export const getTask = async (req, res) => {
  try {
    const taskId = req.params.id; // Get task ID from URL

    // Find the task by ID
    const task = await Task.findById({ _id: taskId });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ message: "Error fetching task", error });
  }
};
