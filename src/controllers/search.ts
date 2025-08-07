import { Request, Response } from "express";
import User from "../models/user";
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

