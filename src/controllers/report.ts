import { NextFunction, Request, Response } from "express";
import { createError } from "../helper/errorMiddleware";
import Report from "../models/report";
import mongoose, { Types } from "mongoose";
import { User } from "../models/user";
import Attendance from "../models/attendance";
import Task, { ITask } from "../models/task";
import LeaveRequest from "../models/LeaveRequest";


interface CreateEmployeeReportBody {
  currentProject: string;
  startTime: string;
  endTime: string;
  effectiveHours: number;
  completedTasks?: (string | mongoose.Types.ObjectId)[];
  plannedTasks?: (string | mongoose.Types.ObjectId)[];
  performance?: string;
  challenges?: string;
  supportNeeded?: string;
  managerId?: string;
}

interface CreateEmployeeReportParams {
  id: string;
}


export const createEmployReports = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const reports = req.body;

  if (!Array.isArray(reports) || reports.length === 0) {
    return next(createError(400, "No reports provided or reports is not an array"));
  }

  try {
    const manager = await User.findById(id).populate("managerId", "name");
    if (!manager) {
      return next(createError(404, "User not found"));
    }

    const to24HourFormat = (timeStr: string) => {
      const date = new Date(`1970-01-01 ${timeStr}`);
      if (isNaN(date.getTime())) throw new Error(`Invalid time: ${timeStr}`);
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    };

    const toMinutes = (timeStr: string) => {
      const parts = timeStr.split(":").map(Number);
      return (parts[0] || 0) * 60 + (parts[1] || 0) + ((parts[2] || 0) / 60);
    };

    const savedReports = [];

    for (const r of reports) {
      const {
        currentProject,
        startTime,
        endTime,
        completedTasks,
        plannedTasks,
        performance,
        challenges,
        supportNeeded,
        date
      } = r;

      if (!currentProject || !startTime || !endTime) {
        return next(createError(400, "Missing required fields: currentProject, startTime, or endTime"));
      }

      // Parse the report date - must be provided from frontend
      if (!date) {
        return next(createError(400, "Date is required for each report"));
      }
      
      const reportDate = new Date(date);
      if (isNaN(reportDate.getTime())) {
        return next(createError(400, "Invalid date format provided"));
      }
      reportDate.setHours(0, 0, 0, 0);

      // Set date range for the specific report date
      const reportDateStart = new Date(reportDate);
      reportDateStart.setHours(0, 0, 0, 0);
      const reportDateEnd = new Date(reportDate);
      reportDateEnd.setHours(23, 59, 59, 999);

      // Check for approved regularization for the specific report date
      const approvedRegularization = await LeaveRequest.findOne({
        employeeId: id,
        leaveType: 'Regularization',
        status: 'Approve',
        date: { $gte: reportDateStart, $lte: reportDateEnd }
      });

      // Find attendance for the specific report date
      const attendance = await Attendance.findOne({
        employeeId: id,
        date: { $gte: reportDateStart, $lte: reportDateEnd },
      });

      if (!attendance) {
        return next(createError(400, `No attendance found for ${reportDate.toDateString()}`));
      }

      let formattedStart = to24HourFormat(startTime);
      let formattedEnd = to24HourFormat(endTime);

      // Apply regularization if approved for this specific date
      if (approvedRegularization) {
        formattedStart = '09:00';
        formattedEnd = '17:00';
      }

      const reportStartMinutes = toMinutes(formattedStart);
      const reportEndMinutes = toMinutes(formattedEnd);
      const signInMinutes = toMinutes(attendance.signInTime || "00:00");
      const signOutMinutes = toMinutes(attendance.signOutTime || "23:59");

      // Validate time ranges only if no approved regularization
      if (!approvedRegularization) {
        if (reportStartMinutes < signInMinutes) {
          return next(
            createError(
              400,
              `Report start time (${formattedStart}) cannot be before attendance sign-in time (${attendance.signInTime}) for ${reportDate.toDateString()}`
            )
          );
        }
        if (reportEndMinutes > signOutMinutes) {
          return next(
            createError(
              400,
              `Report end time (${formattedEnd}) cannot be after attendance sign-out time (${attendance.signOutTime}) for ${reportDate.toDateString()}`
            )
          );
        }
      }

      // Calculate report time
      const reportTimeMinutes = reportEndMinutes - reportStartMinutes;
      const reportTimeHours = reportTimeMinutes / 60;

      // Validate total report time doesn't exceed attendance duration (only if no regularization)
      if (!approvedRegularization) {
        const attendanceDuration = signOutMinutes - signInMinutes;
        if (reportTimeMinutes > attendanceDuration) {
          return next(
            createError(
              400,
              `Report time (${reportTimeHours.toFixed(2)} hours) exceeds attendance duration (${(attendanceDuration / 60).toFixed(2)} hours) for ${reportDate.toDateString()}`
            )
          );
        }
      }

      // Process tasks and validate time
      const allTaskIds: mongoose.Types.ObjectId[] = [];
      const completed = Array.isArray(completedTasks)
        ? completedTasks
            .map((t: any) => {
              const taskId = t?.value || t;
              if (mongoose.Types.ObjectId.isValid(taskId)) {
                allTaskIds.push(new mongoose.Types.ObjectId(taskId));
                return new mongoose.Types.ObjectId(taskId);
              }
              return null;
            })
            .filter(Boolean)
        : [];

      const planned = Array.isArray(plannedTasks)
        ? plannedTasks
            .map((t: any) => {
              const taskId = t?.value || t;
              if (mongoose.Types.ObjectId.isValid(taskId)) {
                allTaskIds.push(new mongoose.Types.ObjectId(taskId));
                return new mongoose.Types.ObjectId(taskId);
              }
              return null;
            })
            .filter(Boolean)
        : [];

      if (allTaskIds.length > 0) {
        const tasks: ITask[] = await Task.find({ _id: { $in: allTaskIds } }).lean();
        const totalTaskHours = tasks.reduce((sum, task) => sum + (task.estimatedHours || 0), 0);
        
        const timeDifference = Math.abs(totalTaskHours - reportTimeHours);
        if (timeDifference > 0.5) {
          return next(
            createError(
              400,
              `Total task time (${totalTaskHours.toFixed(2)} hours) does not match report time (${reportTimeHours.toFixed(2)} hours) for report dated ${reportDate.toDateString()}. Please adjust your tasks or report time.`
            )
          );
        }
      }

      // Update completed tasks status
      if (completed.length > 0) {
        await Task.updateMany(
          { _id: { $in: completed } },
          { $set: { status: "completed" } }
        );
      }

      // Update planned tasks status
      if (planned.length > 0) {
        await Task.updateMany(
          {
            _id: { $in: planned },
            status: { $nin: ["completed", "in-progress"] }
          },
          { $set: { status: "in-progress" } }
        );
      }

      const reportData = new Report({
        projectId: currentProject,
        submittedBy: id,
        submittedTo: manager?.managerId,
        date: reportDate,
        startTime: formattedStart,
        endTime: formattedEnd,
        effectiveHours: reportTimeHours.toFixed(2),
        completedTasks: completed,
        plannedTasks: planned,
        performance: performance || "",
        challenges: challenges || "",
        supportNeeded: supportNeeded || "",
      });

      const savedReport = await reportData.save();
      savedReports.push(savedReport);
    }

    res.status(201).json({
      message: "Employee reports created successfully",
      data: savedReports,
    });
  } catch (error) {
    console.error("Error creating employee reports:", error);
    next(createError(500, "Internal server error"));
  }
};




export const getReportsByEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  if (!id) {
    throw createError(404, "employee not found");
  }

  const report = await Report.find({ submittedBy: id }).populate('completedTasks', 'title').populate('plannedTasks', 'title').sort({ createdAt: -1 });
  if (report.length === 0) {
    throw createError(404, "Reports not found");
  }
  res.status(200).json({
    message: "get report by employee successfully",
    status: "success",
    report,
  });
};




export const updateReportStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const report = await Report.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json({
      message: `Report ${status} successfully`,
      report,
    });
  } catch (error) {
    console.error("Error updating report status:", error);
    res.status(500).json({ message: "Server error" });
  }
};




export const getMyReports = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const total = await Report.countDocuments({ submittedTo: userId });
    const reports = await Report.find({ submittedTo: userId })
      .populate("submittedBy", "name email")
      .populate("projectId", "name")
      .populate("completedTasks plannedTasks", "title")
      .sort({ createdAt: -1, _id: -1 }).skip(skip).limit(limit)

    res.status(200).json({
      count: reports.length,
      reports,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ message: "Server error" });
  }
};



export const getReportStatus = async (req: Request, res: Response) => {
  const employeeId = req.params.id;
  const reports = await Report.find({ employee: employeeId });
  res.json({ report: reports });
}



export const createManagerReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params; 
  const { startTime, endTime, description } = req.body;

  try {
    if (!id || !startTime || !endTime || !description) {
      return next(createError(400, "Missing required fields"));
    }

    const to24HourFormat = (timeStr: string) => {
      const date = new Date(`1970-01-01 ${timeStr}`);
      if (isNaN(date.getTime())) throw new Error(`Invalid time: ${timeStr}`);
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    };

    const toMinutes = (timeStr: string) => {
      const parts = timeStr.split(":").map(Number);
      return (parts[0] || 0) * 60 + (parts[1] || 0) + ((parts[2] || 0) / 60);
    };

    const formattedStart = to24HourFormat(startTime);
    const formattedEnd = to24HourFormat(endTime);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      employeeId: id,
      date: { $gte: today },
    });

    if (!attendance) {
      return next(createError(400, "No attendance found for today"));
    }

    const signInMinutes = toMinutes(attendance.signInTime || "00:00");
    const signOutMinutes = toMinutes(attendance.signOutTime || "23:59");
    const reportStartMinutes = toMinutes(formattedStart);
    const reportEndMinutes = toMinutes(formattedEnd);

    if (
      reportStartMinutes < signInMinutes ||
      reportEndMinutes > signOutMinutes
    ) {
      return next(
        createError(
          400,
          `Report time must be within attendance: ${attendance.signInTime} - ${attendance.signOutTime}`
        )
      );
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const existingReport = await Report.findOne({
      submittedBy: id,
      date: { $gte: todayStart, $lte: todayEnd },
      role: "manager",
      status: { $ne: "rejected" },
    });

    if (existingReport) {
      return next(
        createError(400, "You can submit only one manager report per day")
      );
    }

    const effectiveHours =
      (reportEndMinutes - reportStartMinutes) / 60;

    const reportData = new Report({
      submittedBy: id,
      role: "manager",
      date: new Date(),
      startTime: formattedStart,
      endTime: formattedEnd,
      effectiveHours: effectiveHours.toFixed(2),
      descriptions: description.trim(),
    });

    await reportData.save();

    res.status(201).json({
      message: "Manager report created successfully",
      data: reportData,
    });
  } catch (error) {
    console.error("Error creating manager report:", error);
    next(createError(500, "Internal server error"));
  }
};



export const getReportsByProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { projectId, submittedBy } = req.params;

    if (!projectId || !submittedBy) {
      throw createError(400, "Project ID, submittedBy and submiitedTo are required");
    }

    const reports = await Report.find({ projectId, submittedBy });

    if (!reports || reports.length === 0) {
      throw createError(404, "No reports found for this project");
    }

    res.status(200).json({
      message: "Reports fetched successfully",
      status: "success",
      reports,
      count: reports.length,
    });
  } catch (error) {
    next(error);
  }
};



export const getMyFilteredReport = async (req: Request, res: Response) => {
    const { userId } = req.params
    const { date } = req.query

    if (!date) throw createError(400, 'Date is required')

    const start = new Date(date as string);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date as string);
    end.setHours(23, 59, 59, 999);

    const report = await Report.findOne({ submittedBy: userId, createdAt: { $gte: start, $lte: end } }).populate("projectId", 'name').populate('completedTasks', 'title').populate('plannedTasks', 'title')

    res.json(report)
}



export const getAllEmployeePerformance = async (req: Request, res: Response) => {
  try {
    const reports = await Report.find({}, { effectiveHours: 1, _id: 0 });
    const allHours = reports.map(report => Number(report.effectiveHours));
    const totalEffectiveHours = allHours.reduce((sum, hours) => sum + hours, 0);
    const totalHours = reports.length * 8;

    res.json({ totalEffectiveHours, totalHours });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


