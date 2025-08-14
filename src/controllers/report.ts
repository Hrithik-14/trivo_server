import { NextFunction, Request, Response } from "express";
import { createError } from "../helper/errorMiddleware";
import Report from "../models/report";
import mongoose from "mongoose";
import { User } from "../models/user";

// Request body type
interface CreateEmployeeReportBody {
  currentProject: string;
  startTime: string; // or Date if you're using Date objects
  endTime: string; // or Date
  effectiveHours: number;
  completedTasks?: string[];
  plannedTasks?: string[];
  performance?: string;
  challenges?: string;
  supportNeeded?: string;
  managerId?: string;
  submittedBy?: string;
}

// Request params type
interface Params {
  id: string;
}

export interface StatusUpdate {
  status: "pending" | "accepted" | "rejected";
}

export const createEmployReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const {
    currentProject,
    startTime,
    endTime,
    effectiveHours,
    completedTasks,
    plannedTasks,
    performance,
    challenges,
    supportNeeded,
  } = req.body;

  try {
    let completed;
    let planned;
    if (!id || !currentProject || !startTime || !endTime || !effectiveHours) {
      return next(createError(400, "Missing required fields"));
    }

    // Convert times to 24-hour HH:mm format
    const formatTime = (timeStr: string) => {
      const dateObj = new Date(`1970-01-01T${timeStr}`);
      if (isNaN(dateObj.getTime())) {
        throw new Error(`Invalid time format: ${timeStr}`);
      }
      return dateObj.toTimeString().slice(0, 5);
    };
    if (Array.isArray(completedTasks)) {
      completed = completedTasks.map((task: any) => task.value || task);
    }

    if (Array.isArray(plannedTasks)) {
      planned = plannedTasks.map((task: any) => task.value || task);
    }

    const manager = await User.findOne({ _id: id }).populate(
      "managerId",
      "name"
    );
    const reportData = new Report({
      projectId: currentProject,
      submittedBy: id,
      submittedTo: manager?.managerId,
      date: new Date(), // required field
      startTime: formatTime(startTime),
      endTime: formatTime(endTime),
      effectiveHours,
      completedTasks: completed || [],
      plannedTasks: planned || [],
      performance: performance || "",
      challenges: challenges || "",
      supportNeeded: supportNeeded || "",
    });

    await reportData.save();

    res.status(201).json({
      message: "Employee report created successfully",
      data: reportData,
    });
  } catch (error) {
    console.error("Error creating employee report:", error);
    next(createError(500, "Internal server error"));
  }
};
export const createManagerReport = async(
  req:Request,
  res:Response,
  next:NextFunction
) => {
  const {id} = req.params
  const {startTime,endTime,description} = req.body
  if(!id){
    throw createError(404, "report not found")
  }
  const admin = await User.findOne({role:"admin"})
  if(!admin){
    throw createError(404, "admin not found")
  }

  const formatTime = (timeStr: string) => {
      const dateObj = new Date(`1970-01-01T${timeStr}`);
      if (isNaN(dateObj.getTime())) {
        throw new Error(`Invalid time format: ${timeStr}`);
      }
      return dateObj.toTimeString().slice(0, 5);
    };

  const reportData = new Report({
    submittedBy:id,
    submittedTo:admin?.id,
    startTime:formatTime(startTime),
    endTime:formatTime(endTime),
    descriptions:description
  })
  await reportData.save()

  res.status(200).json({
    message:"Create manager report successfully",
    status:"success",
    reportData
  })
}


export const getReportsByEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  if (!id) {
    throw createError(404, "employee not found");
  }

  const report = await Report.find({ submittedBy: id });
  if (report.length === 0) {
    throw createError(404, "Reports not found");
  }
  res.status(200).json({
    message: "get report by employee successfully",
    status: "success",
    report,
  });
};
export const getProjectByReport = async(
  req:Request,
  res:Response,
  next:NextFunction
) =>{
  const {projectId, submittedBy} = req.body;
  
  const reports = await Report.find({projectId:projectId, submittedBy:submittedBy})
  console.log("reports", reports);

  res.status(200).json({
    message:"successs",
    reports
  })
}

