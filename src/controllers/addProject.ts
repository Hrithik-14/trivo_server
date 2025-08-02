import { Request, Response, NextFunction } from "express";
import Project from "../models/project";

// Define interface for request body
interface ProjectRequestBody {
  name: string;
  startDate: string;
  endDate: string;
  managerId: string;
  description: string;
  client:string
}

const addProjectController = async (
  req: Request<{}, {}, ProjectRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, startDate, endDate, managerId, description,client } = req.body;

    // Validate required fields
    if (!name || !startDate || !endDate || !managerId || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create new project instance
    const project = new Project({
      name,
      startDate: new Date(startDate), // Convert string to Date (if your schema expects Date)
      endDate: new Date(endDate),     // Convert string to Date (if your schema expects Date)
      managerId,
      description,
      client
    });

    // Save the project to the database
    await project.save();

    // Return success response with the saved project
    res.status(201).json({ message: "Project added successfully", project });
  } catch (error) {
    // Pass error to Express error handler
    console.log("error is :", error);
    next(error);
  }
};

export default addProjectController;