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




export const getAttendanceChart = async (req: Request, res: Response) => {
  const { userId } = req.params
  
  
  const records = await Attendance.find({ employeeId: userId }).sort({ date: 1 });

    const data = records.map(record => {
      if (!record.signInTime || !record.signOutTime) return { date: record.date.toISOString().slice(0,10), hours: 0 };
      
      const [inH, inM] = record.signInTime.split(':').map(Number);
      const [outH, outM] = record.signOutTime.split(':').map(Number);

      const inDate = new Date(record.date);
      inDate.setHours(inH, inM, 0, 0);

      const outDate = new Date(record.date);
      outDate.setHours(outH, outM, 0, 0);

      const diffHours = (outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60);

      return { date: record.date.toISOString().slice(0,10), hours: diffHours };
    });

    res.status(200).json(data);
}




export const getMonthlyAttendance = async (req: Request, res:Response) => {
try {
    const employeeId = req.params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({ message: 'Invalid employee ID' });
    }

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setMilliseconds(-1);

    const stats = await Attendance.aggregate([
      {
        $match: {
          employeeId: new mongoose.Types.ObjectId(employeeId),
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    type Status = 'present' | 'absent' | 'late' | 'halfday';

    const result: Record<Status, number> = { present: 0, absent: 0, late: 0, halfday: 0 };


    stats.forEach((item) => {
    const key = item._id as Status;
      if (key in result) {
        result[key] = item.count;
      }
    });

    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
}