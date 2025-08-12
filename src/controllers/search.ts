import { Request, Response } from "express";
import {User} from "../models/user";
import { createError } from "../helper/errorMiddleware";
import Project from "../models/project";

export const searchUsers = async (req: Request, res: Response) => {
  const { query, role } = req.query;
  const filter: Record<string, any> = {};

  if (query) {
    filter.name = { $regex: query, $options: "i" };
  }

  if (role) {
    filter.role = role;
  }


  const users = await User.find(filter);
  res.json({ users });
};

export const searchProject = async (req: Request, res: Response) => {
  const query = req.query.query as string;

  if (!query) {
    return res.status(400).json({ message: "Query is required" });
  }

  const filter = {
    name: { $regex: query, $options: "i" },
  };

  const projects = await Project.find(filter);
  res.json({ projects });
};



export const searchManagerProject = async (req: Request, res: Response) => {
  try {
    const query = req.query.query as string;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Manager ID is required" });
    }

    // If no query provided, return all projects for this manager
    const searchConditions: any = { managerId: id };
    
    if (query && query.trim()) {
      searchConditions.name = { $regex: query.trim(), $options: "i" };
    }

    const projects = await Project.find(searchConditions)
      .select('_id name') // Only select needed fields
      .sort({ name: 1 }); // Sort alphabetically

    res.json(projects); // Return projects directly, not wrapped in object
  } catch (error) {
    console.error("Error in searchManagerProject:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const searchMangersEmployee = async (req: Request, res: Response) => {
    const { managerId } = req.params;
  const { query } = req.query;

  const users = await User.find({
    managerId,
    name: { $regex: query || "", $options: "i" }
  }).select("_id name employeeCode");

  res.json(users);
}