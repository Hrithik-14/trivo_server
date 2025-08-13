import { Request, Response, NextFunction } from "express";
import Project, { IProject } from "../models/project";
import mongoose from "mongoose";
import {User} from "../models/user";
import Task from "../models/task";
import { createError } from "../helper/errorMiddleware";
import { Group } from "../models/Group";

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

    const existingProject = await Project.findOne({ name: name.trim() });
    if (existingProject) {
      return res.status(400).json({
        message: "A project with this name already exists",
      });
    }

    const project = new Project({
      name: name.trim(),
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
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { assignments, projectId } = req.body;

    if (!projectId || !assignments || !Array.isArray(assignments)) {
      return res.status(400).json({ 
        success: false, 
        message: "Project ID and assignments array are required" 
      });
    }

    if (!mongoose.isValidObjectId(projectId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid Project ID format" 
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ 
        success: false, 
        message: "Project not found" 
      });
    }

    const commonTime = new Date();
    const tasksToInsert = [];

    for (const assignment of assignments) {
      const { employeeCode, title } = assignment;
      
      if (!employeeCode || !title) {
        return res.status(400).json({ 
          success: false, 
          message: "Employee code and title are required for all assignments" 
        });
      }

      const user = await User.findOne({ employeeCode });
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: `Employee with code ${employeeCode} not found` 
        });
      }

      tasksToInsert.push({
        title: title.trim(),
        status: 'pending',
        projectId,
        assignedTo: user._id,
        batchTime: commonTime
      });
    }

    const savedTasks = await Task.insertMany(tasksToInsert);
    
    const taskIds = savedTasks.map(task => task._id as mongoose.Types.ObjectId);
    project.tasks.push(...taskIds);
    await project.save();

    const populatedTasks = await Task.find({ 
      _id: { $in: taskIds } 
    }).populate('assignedTo', 'name employeeCode');

    res.status(201).json({ 
      success: true, 
      data: populatedTasks,
      count: savedTasks.length,
      message: `Successfully created ${savedTasks.length} tasks`
    });
  } catch (error) {
    console.error("Error in addTaskController:", error);
    res.status(500).json({ 
      success: false, 
      message: 'Error adding tasks', 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const addManagerProjectController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { projectId, employeeCode } = req.body;
    console.log(req.body);
    
    if (!projectId || !employeeCode) {
      return res.status(400).json({ 
        success: false,
        message: "Project ID and employee code are required" 
      });
    }

    if (!mongoose.isValidObjectId(projectId)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid Project ID format" 
      });
    }

    const project = await Project.findById(projectId).populate("members", "_id name email");
    if (!project) {
      return res.status(404).json({ 
        success: false,
        message: "Project not found" 
      });
    }

    const employee = await User.findOne({ employeeCode });
    if (!employee) {
      return res.status(404).json({ 
        success: false,
        message: "Employee not found" 
      });
    }

    const employeeId = employee._id as mongoose.Types.ObjectId;

    const isAlreadyMember = project.members.some((member) => member._id.equals(employeeId));
    
    if (!isAlreadyMember) {
      project.members.push(employeeId);
      await project.save();
    }

    let group = await Group.findOne({ name: project.name });

    let managerId: mongoose.Types.ObjectId | null = null;
if (project.managerId && mongoose.isValidObjectId(project.managerId)) {
  managerId = project.managerId as mongoose.Types.ObjectId;

  if (!project.members.some((m) => m._id.equals(managerId!))) {
    project.members.push(managerId);
    await project.save();
  }
}

    if (!group) {
        const admin = await User.findOne({ role: "admin" }).select("_id");
        if (!admin) {
          return res.status(500).json({
            success: false,
            message: "Admin user not found. Cannot create group."
          });
        }

      group = new Group({
        name: project.name,
        members: [
      ...project.members.map((m) => m._id),
      ...(managerId ? [managerId] : []),
      ],
        createdBy: admin._id,
        groupImage: null,
      });
      await group.save();
    } else {
      const groupMemberIds = group.members.map((m) => m.toString());
      const newMembers = project.members
        .filter((m) => !groupMemberIds.includes(m._id.toString()))
        .map((m) => m._id as mongoose.Types.ObjectId); 

      if (newMembers.length > 0) {
        group.members.push(...newMembers);
        await group.save();
      }
    }

    const populatedGroup = await Group.findById(group._id)
      .populate("members", "name email")
      .populate("createdBy", "name email");

    res.status(200).json({
      success: true,
      message: isAlreadyMember
        ? "Employee is already a project member"
        : "Employee added to project successfully",
      group: populatedGroup,
    });
  } catch (error) {
    console.error("Error in addManagerProjectController:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
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

    const project = await Project.find().populate('members', 'name').sort({ createdAt: -1, _id: -1 }).skip(skip).limit(limit);
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
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const { id } = req.params;
    console.log(req.params);
    
    const total = await Project.countDocuments({managerId: id});
    const ongoing = await Project.countDocuments({managerId: id, status: 'ongoing' });
    const completed = await Project.countDocuments({managerId: id, status: 'completed' });
    if (!id || typeof id !== "string") {
      throw createError(400, "Invalid or missing manager ID");
    }

    const projects: IProject[] = await Project.find({ managerId: id }).populate('members', 'name').sort({ createdAt: -1, _id: -1 }).skip(skip).limit(limit);

    if (projects.length === 0) {
      throw createError(404, "No projects found for this manager");
    }

    res.status(200).json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      projects,
      stats: {
        total: Number(total),
        ongoing: Number(ongoing),
        completed: Number(completed)
      }
    });
  } catch (error) {
    console.error("Error fetching projects by manager:", error);
    next(error);
  }
};

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