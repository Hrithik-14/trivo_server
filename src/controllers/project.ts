import { Request, Response, NextFunction } from "express";
import Project, { IProject } from "../models/project";
import mongoose from "mongoose";
import {User} from "../models/user";
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
  req: Request,
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
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { isActive } = req.body;
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      throw createError(400, "Invalid project ID");
    }

    const updatedProject = await Project.findByIdAndUpdate(
      id,
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
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    
    const total = await Project.countDocuments();
    const ongoing = await Project.countDocuments({ status: 'ongoing' });
    const completed = await Project.countDocuments({ status: 'completed' });

    const project = await Project.find().populate('members', 'name').sort({ createdAt: -1, _id: -1 }).skip(skip).limit(limit);;
    if(!project){
      throw createError(404, "projects not found")
    }
    res.status(200).json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      project,
      stats: {
        total: Number(total),
        ongoing: Number(ongoing),
        completed: Number(completed)
      }
    })
}


export const getProjectByManager = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.body;
    if (!id || typeof id !== "string") {
      throw createError(400, "Invalid or missing manager ID");
    }

    const projects: IProject[] = await Project.find({ managerId: id });

    if (projects.length === 0) {
      throw createError(404, "No projects found for this manager");
    }

    res.status(200).json({
      message: "Projects retrieved successfully",
      status: "success",
      projects,
    });
  } catch (error) {
    console.error("Error fetching projects by manager:", error);
    next(error);
  }
};

export const getProjectByEmployee = async(
  req:Request,
  res:Response,
  next:NextFunction
) => {
  const {id} = req.params;
   if (!id || typeof id !== "string") {
      throw createError(400, "Invalid or missing employee ID");
    }

    const projects: IProject[] = await Project.find({ members: id }).populate("members");
    if (projects.length === 0) {
      throw createError(404, "No projects found for this manager");
    }
     res.status(200).json({
      message: "Projects retrieved successfully",
      status: "success",
      projects,
    });
}


export const getProjectById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id;
    const project = await Project.findById(id)
      .populate("managerId", "name")
      .populate("members", "name role");

    if (!project) throw createError(404, "Project not found");

    const formattedProject = {
      ...project.toObject(),
      startDate: project.startDate
        ? new Date(project.startDate).toISOString()
        : null,
      endDate: project.endDate ? new Date(project.endDate).toISOString() : null,
    };

    res.status(200).json(formattedProject);
  } catch (error) {
    next(error);
  }
};

export const projectProgressController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body;
  if (!id) {
    throw createError(404, "project not found");
  }
  if (!status) {
    throw createError(404, "status not found");
  }

  const updatedStatus = await Project.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );
  if (!updatedStatus) {
    throw createError(404, "status not found");
  }

  res.status(200).json({
    message: "status updated successfully",
    status: "success",
    updatedStatus,
  });
};




export const updateProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  if(!id){
    throw createError(404,"project not found")
  }
  const {
    name,
    startDate,
    endDate,
    managerId,
    description,
    client,
    clientEmail,
  } = req.body;

  const updatedProject = await Project.findByIdAndUpdate(
    id,
    {
      name,
      startDate,
      endDate,
      managerId,
      description,
      client,
      clientEmail,
    },
    { new: true }
  );
  if(!updatedProject){
    throw createError(404, "updates project not found")
  }

  res.status(200).json({
    message:"updated project successfull",
    status:"success",
    updatedProject
  })
  
};



export const ongoingManagerProject = async (req: Request, res: Response) => {
  const { id } = req.params
  if (!id) return createError(404, 'Not Found')
  const projects = await Project.find({ managerId: id, status: 'ongoing' });

  res.json(projects)
}