import { Request, Response, NextFunction } from "express";
import Task, { ITask } from "../models/task";
import Project from "../models/project";
import mongoose from "mongoose";
import { createError } from "../helper/errorMiddleware";

// // Get all tasks for a specific project and user
// export const getTasksByProjectAndUser = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const { projectId, userId } = req.params;

//     if (!projectId || !userId) {
//       throw createError(400, "Project ID and User ID are required");
//     }

//     // Validate ObjectIds
//     if (!mongoose.isValidObjectId(projectId) || !mongoose.isValidObjectId(userId)) {
//       throw createError(400, "Invalid Project ID or User ID format");
//     }

//     const tasks = await Task.find({
//       projectId,
//       assignedTo: userId,
//     })
//     .populate('assignedTo', 'name employeeCode')
//     .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       data: tasks,
//       count: tasks.length,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // Add a single task for a specific user
// export const addTaskForUser = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const { projectId, userId, title } = req.body;

//     if (!projectId || !userId || !title) {
//       throw createError(400, "Project ID, User ID, and title are required");
//     }

//     // Validate ObjectIds
//     if (!mongoose.isValidObjectId(projectId) || !mongoose.isValidObjectId(userId)) {
//       throw createError(400, "Invalid Project ID or User ID format");
//     }

//     // Validate title length
//     if (title.trim().length < 3) {
//       throw createError(400, "Task title must be at least 3 characters long");
//     }

//     // Check if project exists
//     const project = await Project.findById(projectId);
//     if (!project) {
//       throw createError(404, "Project not found");
//     }

//     // Check if user is a member of the project
//     const isMember = project.members.some(member => member.toString() === userId);
//     if (!isMember) {
//       throw createError(400, "User is not a member of this project");
//     }

//     const newTask = new Task({
//       title: title.trim(),
//       status: 'pending',
//       projectId,
//       assignedTo: userId,
//       batchTime: new Date(),
//     });

//     const savedTask = await newTask.save();
    
//     // Populate the assignedTo field before sending response
//     const populatedTask = await Task.findById(savedTask._id).populate('assignedTo', 'name employeeCode');

//     // Add task to project's tasks array if not already present
//     if (!project.tasks.includes(savedTask._id as mongoose.Types.ObjectId)) {
//       project.tasks.push(savedTask._id as mongoose.Types.ObjectId);
//       await project.save();
//     }

//     res.status(201).json({
//       success: true,
//       data: populatedTask,
//       message: "Task created successfully",
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // Delete a specific task
// export const deleteTask = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const { taskId } = req.params;

//     if (!taskId) {
//       throw createError(400, "Task ID is required");
//     }

//     if (!mongoose.isValidObjectId(taskId)) {
//       throw createError(400, "Invalid Task ID format");
//     }

//     const task = await Task.findById(taskId);
//     if (!task) {
//       throw createError(404, "Task not found");
//     }

//     const deletedTask = await Task.findByIdAndDelete(taskId);

//     // Remove task from project's tasks array
//     await Project.updateOne(
//       { _id: task.projectId },
//       { $pull: { tasks: taskId } }
//     );

//     res.status(200).json({
//       success: true,
//       message: "Task deleted successfully",
//       data: deletedTask,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // Update a specific task
// export const updateTask = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const { taskId } = req.params;
//     const { title, status } = req.body;

//     if (!taskId) {
//       throw createError(400, "Task ID is required");
//     }

//     if (!mongoose.isValidObjectId(taskId)) {
//       throw createError(400, "Invalid Task ID format");
//     }

//     const updateData: Partial<ITask> = {};
    
//     if (title !== undefined) {
//       if (title.trim().length < 3) {
//         throw createError(400, "Task title must be at least 3 characters long");
//       }
//       updateData.title = title.trim();
//     }
    
//     if (status !== undefined) {
//       if (!['pending', 'completed'].includes(status)) {
//         throw createError(400, "Status must be either 'pending' or 'completed'");
//       }
//       updateData.status = status;
//     }

//     const updatedTask = await Task.findByIdAndUpdate(
//       taskId,
//       updateData,
//       { new: true, runValidators: true }
//     ).populate('assignedTo', 'name employeeCode');

//     if (!updatedTask) {
//       throw createError(404, "Task not found");
//     }

//     res.status(200).json({
//       success: true,
//       data: updatedTask,
//       message: "Task updated successfully",
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // Get all tasks for a specific project (grouped by users)
// export const getTasksByProject = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const { projectId } = req.params;

//     if (!projectId) {
//       throw createError(400, "Project ID is required");
//     }

//     if (!mongoose.isValidObjectId(projectId)) {
//       throw createError(400, "Invalid Project ID format");
//     }

//     const tasks = await Task.find({ projectId })
//       .populate('assignedTo', 'name employeeCode')
//       .sort({ createdAt: -1 });

//     // Group tasks by user
//     const tasksByUser = tasks.reduce((acc, task) => {
//       const userId = task.assignedTo?._id.toString();
//       if (userId) {
//         if (!acc[userId]) {
//           acc[userId] = [];
//         }
//         acc[userId].push(task);
//       }
//       return acc;
//     }, {} as Record<string, ITask[]>);

//     res.status(200).json({
//       success: true,
//       data: tasksByUser,
//       totalTasks: tasks.length,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // Bulk add tasks (for the existing addTask endpoint compatibility)
// export const addBulkTasks = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const { assignments, projectId } = req.body;

//     if (!projectId || !assignments || !Array.isArray(assignments)) {
//       throw createError(400, "Project ID and assignments array are required");
//     }

//     if (!mongoose.isValidObjectId(projectId)) {
//       throw createError(400, "Invalid Project ID format");
//     }

//     // Check if project exists
//     const project = await Project.findById(projectId);
//     if (!project) {
//       throw createError(404, "Project not found");
//     }

//     const commonTime = new Date();
//     const tasksToInsert = assignments.map((assignment: { employeeCode: string, title: string }) => ({
//       title: assignment.title.trim(),
//       status: 'pending',
//       projectId,
//       assignedTo: assignment.employeeCode, // This should be userId, not employeeCode
//       batchTime: commonTime
//     }));

//     const savedTasks = await Task.insertMany(tasksToInsert);
    
//     // Add all task IDs to project's tasks array
//     const taskIds = savedTasks.map(task => task._id as mongoose.Types.ObjectId);
//     project.tasks.push(...taskIds);
//     await project.save();

//     // Populate the saved tasks
//     const populatedTasks = await Task.find({ 
//       _id: { $in: taskIds } 
//     }).populate('assignedTo', 'name employeeCode');

//     res.status(201).json({ 
//       success: true, 
//       data: populatedTasks,
//       count: savedTasks.length,
//       message: `${savedTasks.length} tasks created successfully`
//     });
//   } catch (error) {
//     next(error);
//   }
// };













export const getTasksByProjectAndUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { projectId, userId } = req.params;

    if (!projectId || !userId) {
      throw createError(400, "Project ID and User ID are required");
    }

    // Validate ObjectIds
    if (!mongoose.isValidObjectId(projectId) || !mongoose.isValidObjectId(userId)) {
      throw createError(400, "Invalid Project ID or User ID format");
    }

    const tasks = await Task.find({
      projectId,
      assignedTo: userId,
    })
    .populate('assignedTo', 'name employeeCode')
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: tasks,
      count: tasks.length,
    });
  } catch (error) {
    next(error);
  }
};

// Add a single task for a specific user
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

    // Validate ObjectIds
    if (!mongoose.isValidObjectId(projectId) || !mongoose.isValidObjectId(userId)) {
      throw createError(400, "Invalid Project ID or User ID format");
    }

    // Validate title length
    if (title.trim().length < 3) {
      throw createError(400, "Task title must be at least 3 characters long");
    }

    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      throw createError(404, "Project not found");
    }

    // Check if user is a member of the project
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
    
    // Populate the assignedTo field before sending response
    const populatedTask = await Task.findById(savedTask._id).populate('assignedTo', 'name employeeCode');

    // Add task to project's tasks array if not already present
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

// Delete a specific task
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

    // Remove task from project's tasks array
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

// Update a specific task
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

// Get all tasks for a specific project (grouped by users)
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

    // Group tasks by user
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