import { Request, Response, NextFunction } from "express";
import Project from "../models/project";
import mongoose from "mongoose";
import User from "../models/user";
import Task from "../models/task";
import { createError } from "../helper/errorMiddleware";

interface ProjectRequestBody {
  name: string;
  startDate: string;
  endDate: string;
  managerId: string;
  employeeCode: string;
  description: string;
  client: string;
  clientEmail: string;
  role: string;
  title: string;
  tasks: {
    title: string;
  };
  projectId: string;
  isActive: Boolean;
  id: String;
}

export const addAdminProjectController = async (
  req: Request<{}, {}, ProjectRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      name,
      startDate,
      endDate,
      managerId,
      description,
      client,
      clientEmail,
    } = req.body;

    if (
      !name ||
      !startDate ||
      !endDate ||
      !managerId ||
      !description ||
      !client ||
      !clientEmail
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const project = new Project({
      name,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      managerId,
      description,
      client,
      clientEmail,
    });

    await project.save();

    res.status(201).json({ message: "Project added successfully", project });
  } catch (error) {
    console.log("error is :", error);
    next(error);
  }
};
export const addTaskController = async (
  req: Request<{}, {}, ProjectRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { projectId, employeeCode, title } = req.body;

    if (!projectId || !employeeCode) {
      res.status(404).json({ message: "all are required" });
    }
    const addTask = new Task({
      projectId,
      assignedTo: employeeCode,
      title,
    });

    await addTask.save();
    res.status(200).json({
      message: "completed",
      status: "success",
      addTask,
    });
  } catch (error) {
    console.log("Error is the powerfull toola : ", error);
  }
};

export const addManagerProjectController = async (
  req: Request<{}, {}, ProjectRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { projectId, employeeCode } = req.body;

    if (!projectId || !employeeCode) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (
      !mongoose.isValidObjectId(projectId) ||
      !mongoose.isValidObjectId(employeeCode)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid projectId or employeeCode" });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const employeeId = new mongoose.Types.ObjectId(employeeCode);

    if (!project.members.some((member) => member.equals(employeeId))) {
      project.members.push(employeeId);
    }

    const employeeTasks = await Task.find({
      projectId,
      assignedTo: employeeCode,
    });

    const newTaskIds = employeeTasks
      .map((task) => task._id)
      .filter((taskId) => !project.tasks.some((t) => t.equals(taskId)));

    project.tasks.push(...newTaskIds);

    await project.save();

    res.status(200).json({
      message: "Project assigned successfully",
      status: "completed",
    });
  } catch (error) {
    console.error("Error in addManagerProjectController:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const toggleActiveController = async (
  req: Request<{ _id: string }, {}, ProjectRequestBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { isActive } = req.body;
    const { _id } = req.params;

    if (!mongoose.isValidObjectId(_id)) {
      throw createError(400, "Invalid project ID");
    }

    const updatedProject = await Project.findByIdAndUpdate(
      _id,
      { isActive },
      { new: true }
    );

    if (!updatedProject) {
      throw createError(404, "Project not found");
    }

    res.status(200).json({
      message: "Project active status updated successfully",
      status: "success",
      data: updatedProject,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllProject = async (
  req: Request<{ _id: string }, {}, ProjectRequestBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const project = await Project.find();
    if (!project) {
      throw createError(404, "projects not found");
    }
    res.status(200).json({
      message: "get projects successfully",
      status: "success",
      project,
    });
  } catch (error) {
    console.log("error is :", error);
    next(error);
  }
};

// export const getProjectByManager = async (
//   req: Request<{}, {}, ProjectRequestBody>,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const { id } = req.body;

//     if (!mongoose.isValidObjectId(id)) {
//       throw createError(400, "Invalid manager ID");
//     }
//     const project = await Project.find({ managerId: id });
//     if (!project) {
//       throw createError(404, "projects not found");
//     }

//     const managerProject = [];
//     if (project === id) {
//       managerProject.push(project);
//     }
//     if (!managerProject) {
//       throw createError(404, "manager project not found");
//     }
//     res.status(200).json({
//       message: "manager project successfully",
//       status: "status",
//       managerProject,
//     });
//   } catch (error) {
//     console.log("error is :", error);
//     next(error);
//   }
// };
