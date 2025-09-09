import { Request, Response } from "express";
import LeaveRequest from "../models/LeaveRequest";
import { createError } from "../helper/errorMiddleware";
import Attendance from "../models/attendance";
import { acceptedleaveRequest, getLeaveRequestEmail } from "./email";
import { User } from "../models/user";
import { sendEmail } from "../utils/sendEmail";
import CompOff from "../models/CompOff";
import mongoose from "mongoose";
import Notification from "../models/notification"

export const createLeaveRequest = async (req: Request, res: Response) => {

    const { leaveDate, leaveType, description } = req.body;
    const userId = req.user?.id;
    let requestTo;

  const start = new Date(leaveDate);
  const end = new Date(leaveDate);
  end.setDate(end.getDate() + 1);


    const maxSickLeaves = 20;
    const approvedSickLeaves = await LeaveRequest.countDocuments({
        employeeId: userId,
        leaveType: "Sick",
        status: "Approve",
    });

    if (leaveType === "Sick" && approvedSickLeaves >= maxSickLeaves) {
        return res.status(400).json({ message: `You have already reached the limit of ${maxSickLeaves} sick leaves.`,});
    }

    const existing = await LeaveRequest.findOne({
        employeeId: userId,
        date: { $gte: start, $lt: end },
        status: 'Approve'
    });
    if (existing) {
        return res.status(409).json({ message: "Leave already requested for this date" });
    }

    const employee = await User.findOne({ _id: userId })
    if (!employee) throw new Error("Employee not found");

    if(leaveType === 'CompOff') {

      const totalTaken = await LeaveRequest.countDocuments({ employeeId: userId, leaveType: 'CompOff', status: 'Approve' })
      const compOffDocs = await CompOff.find({ user: userId })
      const totalHave = compOffDocs.reduce((sum, doc) => sum + Number(doc.count), 0);
      if (totalHave <= totalTaken) {throw new Error("Not enough CompOff balance");}
      const admin = await User.findOne({ role: 'admin' })
      if (!admin) throw new Error("Admin not found");

      requestTo = admin._id

    } else if (employee.role === 'employee') {

        if (!employee.managerId) throw new Error("Manager ID not set for this employee");
        requestTo = employee?.managerId

    } else {

        const admin = await User.findOne({ role: 'admin' })
        if (!admin) throw new Error("Admin not found");
    
        requestTo = admin._id
    }

  const leaveRequest = {
    employeeId: userId,
    requestTo,
    date: leaveDate,
    leaveType,
    description,
  };

  const leave = new LeaveRequest(leaveRequest);
  await leave.save();

const employeeDetails = await User.findById(userId).select("name email role managerId");

if (!employeeDetails || !employeeDetails.email) {
  throw createError(400, "Employee email is missing");
}

let managerEmail: string | undefined;
let managerName: string | undefined;

if (employeeDetails.role === "employee") {
  const manager = await User.findById(employeeDetails.managerId).select("name email");
  if (!manager || !manager.email) {
    throw createError(400, "Manager email is missing");
  }
  managerEmail = manager.email;
  managerName = manager.name;
} else if (employeeDetails.role === "manager") {
  const admin = await User.findOne({ role: "admin" }).select("name email");
  if (!admin || !admin.email) {
    throw createError(400, "Admin email is missing");
  }
  managerEmail = admin.email;
  managerName = admin.name;
} else {
  throw createError(400, "Leave request cannot be sent for this role");
}

await sendEmail({
  from: `"${employeeDetails.name}" <${employeeDetails.email}>`,
  to: managerEmail,
  subject: "New Leave Request",
  html: getLeaveRequestEmail({
    employeeName: employeeDetails.name ?? "Employee",
    managerName: managerName ?? "Manager",
    leaveType,
    description,
    date: new Date(leaveDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  }),
});

  res.status(201).json({ message: "Leave Request successfull", leave });
};

export const acceptLeaveRequest = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, date } = req.body;
  const userId = req.user?.id;

  if (!["Approve", "Reject"].includes(status))
    throw createError(400, "Invalid status value");

  const acceptRequest = await LeaveRequest.findOneAndUpdate(
    { _id: id, requestTo: userId },
    { status },
    { new: true }
  ).populate("employeeId", "name profileImage");

  if (!acceptRequest) throw createError(404, "Leave request not found");

  if (status === "Approve") {
    const attendance = new Attendance({
      employeeId: acceptRequest.employeeId,
      date: date,
      status: "absent",
    });
    await attendance.save();
  }
  const employeeDetails = await User.findById(acceptRequest.employeeId).select(
    "name email profileImage"
  );
  if (!employeeDetails || !employeeDetails.email) {
    throw createError(400, "Employee email is missing");
  }

  const manager = await User.findById(userId).select("name email");
  if (!manager || !manager.email) {
    throw createError(400, "Manager email is missing");
  }

  await sendEmail({
    from: `"${manager.name}" <${manager.email}>`,         
    to: employeeDetails.email,                            
    subject: `Leave Request ${status}`,
    html: acceptedleaveRequest({
      employeeName: employeeDetails.name ?? "Employee",
      profileImage: employeeDetails.profileImage,
      status,
      date,
      managerName: manager.name || "Manager",
    }),
  });
 
  await Notification.findOneAndUpdate(
  { entityId: id, receiverId: acceptRequest.employeeId }, 
  { 
    senderId: userId, 
    receiverId: acceptRequest.employeeId, 
    type: "leaveRequest", 
    action: status, 
    entityId: id, 
    description: `Your leave request was ${status} by manager` 
  },
  { new: true, upsert: true }
);


  res
    .status(200)
    .json({ message: `Leave request ${status} succesfully`, acceptRequest });
};

export const getLeaveRequest = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const request = await LeaveRequest.find({
    requestTo: userId,
    leaveType: { $ne: "Regularization" },
  })
    .sort({ createdAt: -1 })
    .populate("employeeId", "name profileImage");
  res.json(request);
};

export const getMyRequest = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const request = await LeaveRequest.find({ employeeId: userId, leaveType: { $ne: "Regularization" }, })
    .populate("employeeId", "name profileImage")
    .sort({ createdAt: -1 })
  res.json(request);
};


export const getSpecificDay = async (req: Request, res:Response) => {
    const { date } = req.query
    const userId = req.user?.id

    const start = new Date(date as string)
    const end = new Date(date as string)
    end.setDate(end.getDate() + 1)

    const des = await LeaveRequest.findOne({ employeeId: userId, date: { $gte: start, $lt: end }, status: 'Approve'  })
    const dayStatus = await Attendance.findOne({ date: { $gte: start, $lt: end }, employeeId: userId })
    if (!dayStatus) throw createError(200, 'No status found')

    res.json({dayStatus, des: des || null})
}




export const getRegularizationRequest = async (req: Request, res: Response) => {
  const userid = req.user?.id;
  const requesst = await LeaveRequest.find({
    requestTo: userid,
    leaveType: "Regularization",
  }).populate("employeeId", "name profileImage")
  .sort({ createdAt: -1 })
  res.json(requesst);
};

export const getMyRegularization = async (req: Request, res: Response) => {
  const userid = req.user?.id;
  const requesst = await LeaveRequest.find({
    employeeId: userid,
    leaveType: "Regularization",
  }).sort({ createdAt: -1 })
  res.json(requesst);
};



export const totalLeaveCount = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    const today = new Date()
    const year = today.getFullYear()

    const startOfYear = new Date(year, 0, 1)
    const endOfYear = new Date(year, 11, 31, 23, 59, 59)

    const leaveCounts = await LeaveRequest.aggregate([
      {
        $match: {
          employeeId: new mongoose.Types.ObjectId(userId),
          status: 'Approve',
          date: { $gte: startOfYear, $lte: endOfYear },
        },
      },
      {
        $group: {
          _id: '$leaveType',
          count: { $sum: 1 },
        },
      },
    ])

    const counts: Record<string, number> = {
      Sick: 0,
      Paternity: 0,
      Maternity: 0,
      Casual: 0,
      Privilege: 0,
      CompOff: 0,
    }

    leaveCounts.forEach((item) => {
      counts[item._id] = item.count
    })

    const compOffDoc = await CompOff.findOne({ user: userId })
    const CompOffHave = compOffDoc?.count || 0

    res.json({
      sickCount: counts.Sick,
      PaternityCount: counts.Paternity,
      MaternityCount: counts.Maternity,
      CasualCount: counts.Casual,
      PrivilegeCount: counts.Privilege,
      CompOffCount: counts.CompOff,
      CompOffHave,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error' })
  }
}
