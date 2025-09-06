import { Request, Response, NextFunction } from "express";
import Project, { IProject } from "../models/project";
import mongoose, { Document, Types } from "mongoose";
import { User } from "../models/user";
import Task, { ITask } from "../models/task";
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
interface AddManagerProjectBody {
  projectId: string;
  employeeCode: string;
}




export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  employeeCode: string;
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
        message: "Project ID and assignments array are required",
      });
    }

    if (!mongoose.isValidObjectId(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Project ID format",
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const commonTime = new Date();
    const tasksToInsert = [];

    for (const assignment of assignments) {
      const { employeeCode, title } = assignment;

      if (!employeeCode || !title) {
        return res.status(400).json({
          success: false,
          message: "Employee code and title are required for all assignments",
        });
      }

      const user = await User.findOne({ employeeCode });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: `Employee with code ${employeeCode} not found`,
        });
      }

      tasksToInsert.push({
        title: title.trim(),
        status: "pending",
        projectId,
        assignedTo: user._id,
        batchTime: commonTime,
      });
    }

    const savedTasks = await Task.insertMany(tasksToInsert);

    const taskIds = savedTasks.map(
      (task) => task._id as mongoose.Types.ObjectId
    );
    project.tasks.push(...taskIds);
    await project.save();

    const populatedTasks = await Task.find({
      _id: { $in: taskIds },
    }).populate("assignedTo", "name employeeCode");

    res.status(201).json({
      success: true,
      data: populatedTasks,
      count: savedTasks.length,
      message: `Successfully created ${savedTasks.length} tasks`,
    });
  } catch (error) {
    console.error("Error in addTaskController:", error);
    res.status(500).json({
      success: false,
      message: "Error adding tasks",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

interface AddManagerProjectBody {
  projectId: string;
  employeeCode: string;
}





export const addManagerProjectController = async (
  req: Request<{}, {}, AddManagerProjectBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { projectId, employeeCode } = req.body;

    // Validate input
    if (!projectId || !employeeCode) {
      return res.status(400).json({
        success: false,
        message: 'Project ID and employee code are required',
      });
    }

    if (!mongoose.isValidObjectId(projectId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Project ID format',
      });
    }

    // Find project and populate members.user
    const project = await Project.findById(projectId).populate('members.user', '_id name email employeeCode');
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Find employee
    const employee = await User.findOne({ employeeCode });
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    const employeeId = employee._id;

    // Check for invalid member entries and filter them
    const validMembers = project.members.filter((member) => member.user && mongoose.isValidObjectId(member.user._id));
    if (project.members.length !== validMembers.length) {
      console.warn(`Project ${projectId} has ${project.members.length - validMembers.length} invalid member entries.`);
      project.members = validMembers; // Clean up invalid members
      await project.save(); // Save cleaned project
    }

    // Check if employee is already a member
    const isAlreadyMember = project.members.some((member) =>
      member.user && member.user._id.equals(employeeId)
    );

    if (isAlreadyMember) {
      return res.status(200).json({
        success: true,
        message: 'Employee is already a project member',
        group: null,
      });
    }

    // Add employee to project members
    project.members.push({ user: employeeId, isActive: true });
    await project.save();

    // Find or create group
    let group = await Group.findOne({ name: project.name });

    if (!group) {
      const admin = await User.findOne({ role: 'admin' }).select('_id');
      if (!admin) {
        return res.status(500).json({
          success: false,
          message: 'Admin user not found. Cannot create group.',
        });
      }

      group = new Group({
        name: project.name,
        members: [
          ...project.members.map((m) => m.user),
          project.managerId, // Include manager
        ],
        createdBy: admin._id,
        groupImage: null,
      });
      await group.save();
    } else {
      // Update group members if employee is not already included
      const groupMemberIds = group.members.map((m) => m.toString());
      if (!groupMemberIds.includes(employeeId.toString())) {
        group.members.push(employeeId);
        await group.save();
      }
    }

    // Populate group for response
    const populatedGroup = await Group.findById(group._id)
      .populate('members', 'name email')
      .populate('createdBy', 'name email');

    return res.status(200).json({
      success: true,
      message: 'Employee added to project successfully',
      group: populatedGroup,
    });
  } catch (error: any) {
    console.error('Error in addManagerProjectController:', error);
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
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
  const ongoing = await Project.countDocuments({ status: "ongoing" });
  const completed = await Project.countDocuments({ status: "completed" });

  const project = await Project.find()
    .populate("members.user", "name")
    .sort({ createdAt: -1, _id: -1 })
    .skip(skip)
    .limit(limit);
  if (!project) {
    throw createError(404, "projects not found");
  }
  res.status(200).json({
    total,
    page,
    totalPages: Math.ceil(total / limit),
    project,
    stats: {
      total: Number(total),
      ongoing: Number(ongoing),
      completed: Number(completed),
    },
  });
};

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

    const total = await Project.countDocuments({ managerId: id });
    const ongoing = await Project.countDocuments({
      managerId: id,
      status: "ongoing",
    });
    const completed = await Project.countDocuments({
      managerId: id,
      status: "completed",
    });
    if (!id || typeof id !== "string") {
      throw createError(400, "Invalid or missing manager ID");
    }

    const projects: IProject[] = await Project.find({ managerId: id })
      .populate("members.user", "name")
      .sort({ createdAt: -1, _id: -1 })
      .skip(skip)
      .limit(limit);

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
        completed: Number(completed),
      },
    });
  } catch (error) {
    console.error("Error fetching projects by manager:", error);
    next(error);
  }
};

export const getProjectByEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  if (!id || typeof id !== "string") {
    throw createError(400, "Invalid or missing employee ID");
  }

  const projects: IProject[] = await Project.find({ 'members.user': id }).populate(
    "members.user"
  );
  if (projects.length === 0) {
    throw createError(404, "No projects found for this manager");
  }
  res.status(200).json({
    message: "Projects retrieved successfully",
    status: "success",
    projects,
  });
};

export const getProjectById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id;
    const project = await Project.findById(id)
      .populate("managerId", "name profileImage employeeCode")
      // .populate("members")
      .populate("members.user", " name role profileImage employeeCode");

    if (!project) throw createError(404, "Project not found");

    const formattedProject = {
      ...project.toObject(),
      startDate: project.startDate
        ? new Date(project.startDate).toISOString()
        : null,
      endDate: project.endDate ? new Date(project.endDate).toISOString() : null,
    };
console.log("formattedProject", formattedProject);
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

  res.status(200).json(updatedStatus);
};

export const updateProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  if (!id) {
    throw createError(404, "project not found");
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
  if (!updatedProject) {
    throw createError(404, "updates project not found");
  }

  res.status(200).json({
    message: "updated project successfull",
    status: "success",
    updatedProject,
  });
};

export const ongoingManagerProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) return createError(404, "Not Found");
  const projects = await Project.find({ managerId: id, status: "ongoing" });

  res.json(projects);
};

export const getMemeberproject = async (req: Request, res: Response) => {
  try {
    const { memberId } = req.params;
    const projects = await Project.find({ 'members.user': memberId, status: 'Ongoing' }).sort({ startDate: -1 });

    res.status(200).json(projects);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getProjectsByMember = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const { memberId } = req.params;

    const memberObjectId = new mongoose.Types.ObjectId(memberId);

    const total = await Project.countDocuments({ 'members.user': memberObjectId });
    const ongoing = await Project.countDocuments({
      'members.user': memberObjectId,
      status: "Ongoing",
    });
    const completed = await Project.countDocuments({
      'members.user': memberObjectId,
      status: "Completed",
    });
    const projects = await Project.find({ 'members.user': memberObjectId })
      .populate("members.user")
      .populate("managerId")
      .sort({ createdAt: -1, _id: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      stats: {
        total: Number(total),
        ongoing: Number(ongoing),
        completed: Number(completed),
      },
      projects,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};


export const toggleMemberStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { projectId, memberId } = req.params; // here memberId = members._id

  try {
    // Find project with that member subdocument
    const project = await Project.findOne({
      _id: projectId,
      "members._id": memberId,
    });
    if (!project) {
      return res.status(404).json({ message: "Project or member not found" });
    }

    // Find index of that subdocument by its _id
    const memberIndex = project.members.findIndex(
      (m) => m._id && m._id.toString() === memberId
    );

    if (memberIndex === -1) {
      return res.status(404).json({ message: "Member not found in project" });
    }

    // Toggle isActive
    project.members[memberIndex].isActive = !project.members[memberIndex].isActive;

    await project.save();

    res.json(project);
  } catch (err) {
    next(err);
  }
};
