import { Request, Response, NextFunction } from "express";
import Task, { ITask } from "../models/task";
import Project from "../models/project";
import mongoose from "mongoose";
import { createError } from "../helper/errorMiddleware";


export const getTasksByProjectAndUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { projectId, memberId } = req.params;
          console.log(projectId, '||', memberId);


    if (!projectId || !memberId) {
      throw createError(400, "Project ID and User ID are required");
    }

    if (!mongoose.isValidObjectId(projectId) || !mongoose.isValidObjectId(memberId)) {
      throw createError(400, "Invalid Project ID or User ID format");
    }

    const tasks = await Task.find({
      projectId,
      assignedTo: memberId,
    })
    .populate('assignedTo', 'name employeeCode')
    .sort({ createdAt: -1 });
    console.log(tasks);

    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

export const addTaskForUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { projectId, userId, title } = req.body;

    if (!projectId || !userId || !title) {
      throw createError(400, "Project ID, User ID, and title are required");
    }

    if (!mongoose.isValidObjectId(projectId) || !mongoose.isValidObjectId(userId)) {
      throw createError(400, "Invalid Project ID or User ID format");
    }

    if (title.trim().length < 3) {
      throw createError(400, "Task title must be at least 3 characters long");
    }

    const project = await Project.findById(projectId);
    if (!project) {
      throw createError(404, "Project not found");
    }

    const isMember = project.members.some(member => member.toString() === userId);
    if (!isMember) {
      throw createError(400, "User is not a member of this project");
    }

    const newTask = new Task({
      title: title.trim(),
      status: 'pending',
      projectId,
      assignedTo: userId,
      batchTime: new Date(),
    });

    const savedTask = await newTask.save();
    
    const populatedTask = await Task.findById(savedTask._id).populate('assignedTo', 'name employeeCode');

    if (!project.tasks.includes(savedTask._id as mongoose.Types.ObjectId)) {
      project.tasks.push(savedTask._id as mongoose.Types.ObjectId);
      await project.save();
    }

    res.status(201).json({
      success: true,
      data: populatedTask,
      message: "Task created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { taskId } = req.params;

    if (!taskId) {
      throw createError(400, "Task ID is required");
    }

    if (!mongoose.isValidObjectId(taskId)) {
      throw createError(400, "Invalid Task ID format");
    }

    const task = await Task.findById(taskId);
    if (!task) {
      throw createError(404, "Task not found");
    }

    const deletedTask = await Task.findByIdAndDelete(taskId);

    await Project.updateOne(
      { _id: task.projectId },
      { $pull: { tasks: taskId } }
    );

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      data: deletedTask,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { taskId } = req.params;
    const { title, status } = req.body;

    if (!taskId) {
      throw createError(400, "Task ID is required");
    }

    if (!mongoose.isValidObjectId(taskId)) {
      throw createError(400, "Invalid Task ID format");
    }

    const updateData: Partial<ITask> = {};
    
    if (title !== undefined) {
      if (title.trim().length < 3) {
        throw createError(400, "Task title must be at least 3 characters long");
      }
      updateData.title = title.trim();
    }
    
    if (status !== undefined) {
      if (!['pending', 'completed'].includes(status)) {
        throw createError(400, "Status must be either 'pending' or 'completed'");
      }
      updateData.status = status;
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      updateData,
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name employeeCode');

    if (!updatedTask) {
      throw createError(404, "Task not found");
    }

    res.status(200).json({
      success: true,
      data: updatedTask,
      message: "Task updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getTasksByProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      throw createError(400, "Project ID is required");
    }

    if (!mongoose.isValidObjectId(projectId)) {
      throw createError(400, "Invalid Project ID format");
    }

    const tasks = await Task.find({ projectId })
      .populate('assignedTo', 'name employeeCode')
      .sort({ createdAt: -1 });

    const tasksByUser = tasks.reduce((acc, task) => {
      const userId = task.assignedTo?._id.toString();
      if (userId) {
        if (!acc[userId]) {
          acc[userId] = [];
        }
        acc[userId].push(task);
      }
      return acc;
    }, {} as Record<string, ITask[]>);

    res.status(200).json({
      success: true,
      data: tasksByUser,
      totalTasks: tasks.length,
    });
  } catch (error) {
    next(error);
  }
};