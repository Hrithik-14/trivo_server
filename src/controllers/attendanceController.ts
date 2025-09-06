
import mongoose from "mongoose";
import { createError } from "../helper/errorMiddleware"
import Attendance from "../models/attendance";
import { Request, Response } from "express";
import Report from "../models/report";
import { User } from "../models/user";
import nodeCron from "node-cron";
import Holiday from "../models/Holiday";
import LeaveRequest from "../models/LeaveRequest";
import CompOff from "../models/CompOff";

interface MarkAttendanceBody {
  employeeId: string;
  date: string;
  signInTime?: string;
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

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const day = today.getDay()

    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    const timeStr = now.toTimeString().split(' ')[0];

    let attendance = await Attendance.findOne({
      employeeId: employeeObjectId,
      date: today,
    });

    if (attendance && attendance.status === 'absent') {
      return res.status(400).json({ message: 'Attendance already marked as absent' });
    }

    if (!attendance) {
      attendance = new Attendance({
        employeeId: employeeObjectId,
        date: today,
      });
    }

    let user = await CompOff.findOne({ user: employeeObjectId })
    if (!user) {
      user = new CompOff({
        user: employeeObjectId,
        count: 0
      });
    }
    if (day === 0 || day === 6) {
      user.count += 1
    }
    await user.save()

    const officeStart = new Date(today);
    officeStart.setHours(9, 0, 0, 0);

    const officeEnd = new Date(today);
    officeEnd.setHours(17, 0, 0, 0);

    if (type === 'signIn') {
      attendance.signInTime = timeStr;

      if (now > officeStart) {
        attendance.status = 'late';
      } else {
        attendance.status = 'present';
      }
    } else if (type === 'signOut') {
      attendance.signOutTime = timeStr;

      if (attendance.signInTime) {
        const [h, m, s] = attendance.signInTime.split(':').map(Number);
        const signInDate = new Date(today);
        signInDate.setHours(h, m, s);

        const workHours = (now.getTime() - signInDate.getTime()) / (1000 * 60 * 60);

        if (workHours < 7 || now < officeEnd) {
          attendance.status = 'halfday';
        } else if (attendance.status !== 'late') {
          attendance.status = 'present';
        }
      }
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

    if (!employeeId || !mongoose.Types.ObjectId.isValid(employeeId)) {
  return res.status(400).json({ message: "Invalid or missing employeeId" });
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
    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({ message: 'Invalid employee ID' });
    }

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfToday =  new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const stats = await Attendance.aggregate([
      {
        $match: {
          employeeId: new mongoose.Types.ObjectId(employeeId),
          date: { $gte: startOfMonth, $lte: endOfToday },
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


export const getAttendneceHistory = async (req: Request, res: Response) => {
  const { userId } = req.params
  const { filter } = req.query

  let dateFilter: any = {}

  if (filter === "thisMonth") {
    const start = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    const end = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
    dateFilter.date = { $gte: start, $lte: end }
  }else if (filter === 'lastMonth') {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const end = new Date(now.getFullYear(), now.getMonth(), 0)
    dateFilter.date = { $gte: start, $lte: end }
  }

  const present = await Attendance.countDocuments({ employeeId: userId, status: 'present', ...dateFilter })
  const leave = await Attendance.countDocuments({ employeeId: userId, status: 'absent', ...dateFilter })
  const late = await Attendance.countDocuments({ employeeId: userId, status: 'late', ...dateFilter })
  const halfday = await Attendance.countDocuments({ employeeId: userId, status: 'halfday', ...dateFilter })

  const totalDays = present + leave + halfday + late
  const attendacePercentage = totalDays > 0 ? ((present / totalDays) * 100).toFixed(0) : 0

  const reportAdd = await Report.aggregate([
    { $match: { submittedBy: new mongoose.Types.ObjectId(userId), ...(dateFilter.date ? { date: dateFilter.date } : {}) } },
    { $addFields: { effectiveHoursNum: { $toDouble: "$effectiveHours" } } },
    { $group: { _id: null, totalHours: { $sum: "$effectiveHoursNum" } } }
  ])

  const totlaEffectiveHours = reportAdd.length > 0 ? reportAdd[0].totalHours.toFixed(2) : 0

  res.json({ present, leave, late, halfday, totalDays, attendacePercentage, totlaEffectiveHours })
}



export const getMyAttendenceHistory = async(req:Request, res:Response) => {
  const user = req.user?.id
  if(!user){
    throw createError(404,"user not found")

  }

  const attendance = await Attendance.find({employeeId:user })
  res.status(200).json({
    message:"fetched successfully",
    attendance
  })
}


export const totalEmployees = async (req:Request, res:Response) => {
  const allEmployees = await User.countDocuments({role: {$ne:"admin"}})
  res.status(200).json({message:"get total employee success", allEmployees})
}


export const statusAttendence = async (req:Request,res:Response) => {
  const startOfDay = new Date();
  startOfDay.setHours(0,0,0,0);

  const endOfDay = new Date();
  endOfDay.setHours(23,59,59,999)

  const leaveCount = await Attendance.countDocuments({status:"absent",date:{$gte:startOfDay , $lte:endOfDay}})
  const lateCount = await Attendance.countDocuments({status:{$in:["late","halfday"]},date:{$gte:startOfDay , $lte:endOfDay}})
  const presentCount = await Attendance.countDocuments({status:{$in:["late","halfday","present"]},date:{$gte:startOfDay , $lte:endOfDay}})

  res.status(200).json({
    message:"count set success fully",
    leaveCount,
    lateCount,
    presentCount
  })
  
}






const markAbsent = async () => {
  const today = new Date()
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())

  const users = await User.find({ role: { $ne: 'admin' } })
  for (let user of users) {
    const attendance = await Attendance.findOne({ employeeId: user._id, date: startOfDay })
    if (!attendance) await Attendance.create({ employeeId: user._id, date: startOfDay, status: 'absent' })
  }
}


nodeCron.schedule('35 16 * * 1-5', () => {
  markAbsent()
}, {
  timezone: "Asia/Kolkata"
})


export const getAllEmployeeAttendance = async (req: Request, res: Response) => {
  try {
    const { date, employeeId, startDate, endDate, showAll } = req.query;
    
    let attendanceFilter: any = {};
    
    if (showAll === 'true') {
    } else if (date) {
      const filterDate = new Date(date as string);
      const startOfDay = new Date(filterDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(filterDate.setHours(23, 59, 59, 999));
      attendanceFilter.date = { $gte: startOfDay, $lte: endOfDay };
    } else if (startDate && endDate) {
      const start = new Date(startDate as string);
      const end = new Date(endDate as string);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      attendanceFilter.date = { $gte: start, $lte: end };
    } else {
      const today = new Date();
      const startOfToday = new Date(today.setHours(0, 0, 0, 0));
      const endOfToday = new Date(today.setHours(23, 59, 59, 999));
      attendanceFilter.date = { $gte: startOfToday, $lte: endOfToday };
    }
    
    if (employeeId) {
      attendanceFilter.employeeId = employeeId;
    }

    const allUsers = await Attendance.find(attendanceFilter)
      .populate("employeeId", "name employeeCode profileImage")
      .lean();

    let leaveFilter: any = { status: "Approve" };
    
    if (showAll === 'true') {
    } else if (date) {
      const filterDate = new Date(date as string);
      const startOfDay = new Date(filterDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(filterDate.setHours(23, 59, 59, 999));
      leaveFilter.date = { $gte: startOfDay, $lte: endOfDay };
    } else if (startDate && endDate) {
      const start = new Date(startDate as string);
      const end = new Date(endDate as string);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      leaveFilter.date = { $gte: start, $lte: end };
    } else {
      const today = new Date();
      const startOfToday = new Date(today.setHours(0, 0, 0, 0));
      const endOfToday = new Date(today.setHours(23, 59, 59, 999));
      leaveFilter.date = { $gte: startOfToday, $lte: endOfToday };
    }

    if (employeeId) {
      leaveFilter.employeeId = employeeId;
    }

    const approvedLeaves = await LeaveRequest.find(leaveFilter).lean();

    const leaveMap = new Map<string, string>();
    approvedLeaves.forEach((leave) => {
      const key = `${leave.employeeId.toString()}_${new Date(leave.date).toDateString()}`;
      leaveMap.set(key, leave.description || "");
    });

    const result = allUsers.map((att) => {
      const key = `${att.employeeId._id.toString()}_${new Date(att.date).toDateString()}`;
      return {
        ...att,
        leaveDescription: leaveMap.get(key) || null,
      };
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};



export const markHolidays = async(req: Request, res: Response) => {
  const { holiday, description } = req.body

  if ( !holiday || !description ) throw createError(404, 'holiday and description not found')
  
  const existingholiday = await Holiday.find({ date: holiday })
  if (existingholiday.length > 0) throw createError(409, 'Already marked as a Holiday')

  const attendance = new Holiday({
    date: holiday,
    description,
  })
  await attendance.save()

  return res.status(201).json({
    message: "Holiday marked successfully",
    attendance
  });
}


export const getHoliday = async (req: Request, res: Response) => {
  const holidays = await Holiday.find()
  res.status(200).json(holidays)
}