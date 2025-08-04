import { Request, Response, NextFunction } from "express";
import Project from "../models/project";

// Define interface for request body
interface ProjectRequestBody {
  name: string;
  startDate: string;
  endDate: string;
  managerId: string;
  description: string;
  client:string;
  clientEmail:string;
  employeeId:string;
  role:string;
  tasks:string
}

export const addAdminProjectController = async (
  req: Request<{}, {}, ProjectRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, startDate, endDate, managerId, description,client, clientEmail } = req.body;

    // Validate required fields
    if (!name || !startDate || !endDate || !managerId || !description ||!client || !clientEmail) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create new project instance
    const project = new Project({
      name,
      startDate: new Date(startDate), // Convert string to Date (if your schema expects Date)
      endDate: new Date(endDate),     // Convert string to Date (if your schema expects Date)
      managerId,
      description,
      client,
      clientEmail
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

export const addManagerProjectController = async(
    req: Request<{}, {}, ProjectRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const projectId = req.params
    console.log("id is :", projectId);
    
    const {employeeId, role, tasks} = req.body
    if(!employeeId || !role || !tasks){
      console.log("all are required");
    }
    
    

    res.status(200).json({
      message:"completes",
     
    })

  } catch (error) {
    console.log("error is :", error);
    res.status(404).json({message:"not found"})
  }
}