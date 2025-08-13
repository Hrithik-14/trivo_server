import mongoose from "mongoose";
import { createError } from "../helper/errorMiddleware"
import Attendance from "../models/attendance";
import { Request, Response } from "express";

interface MarkAttendanceBody {
  employeeId: string;
  date: string; // ISO date string (e.g. "2025-08-12")
  signInTime?: string; // e.g. "09:00:00"
  signOutTime?: string; 
  status?: 'present' | 'absent' | 'late' | 'halfday';
   type?: 'signIn' | 'signOut';
}


export const markAttendance = async (req: Request<{}, {}, MarkAttendanceBody>, res: Response) => {
 try {
    const { employeeId, type } = req.body;

    if (!employeeId || !type) {
      return res.status(400).json({ message: 'employeeId and type are required' });
    }

    const employeeObjectId = new mongoose.Types.ObjectId(employeeId);

    // Get today's date without time
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get current time string in HH:mm:ss
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];

    let attendance = await Attendance.findOne({
      employeeId: employeeObjectId,
      date: today,
    });

    if (!attendance) {
      attendance = new Attendance({
        employeeId: employeeObjectId,
        date: today,
      });
    }

    if (type === 'signIn') {
      attendance.signInTime = timeStr;
      attendance.status = 'present';
    } else if (type === 'signOut') {
      attendance.signOutTime = timeStr;
    }

    await attendance.save();

    return res.status(200).json({ message: `Attendance ${type} recorded`, attendance });
  } catch (error) {
    console.error('Error in markAttendance:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};



export const getAttendanceByEmployeeDate = async (req: Request, res: Response) => {
  try {
    const { employeeId, date } = req.params;

    if (!employeeId || !date) {
      return res.status(400).json({ message: "employeeId and date required" });
    }

    const employeeObjectId = new mongoose.Types.ObjectId(employeeId);
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      employeeId: employeeObjectId,
      date: attendanceDate,
    });

    if (!attendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }

    res.status(200).json({ attendance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
