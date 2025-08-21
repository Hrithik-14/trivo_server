import { Request, Response } from "express";
import LeaveRequest from "../models/LeaveRequest";
import { createError } from "../helper/errorMiddleware";
import Attendance from "../models/attendance";
import { acceptedleaveRequest, getLeaveRequestEmail } from "./email";
import { User } from "../models/user";
import { sendEmail } from "../utils/sendEmail";

export const createLeaveRequest = async (req: Request, res: Response) => {
  const { date, leaveType, description, requestTo } = req.body;
  const userId = req.user?.id;

  const start = new Date(date);
  const end = new Date(date);
  end.setDate(end.getDate() + 1);

  const existing = await LeaveRequest.findOne({
    employeeId: userId,
    date: { $gte: start, $lt: end },
  });
  if (existing) throw createError(409, "Already requested");

  const leaveRequest = {
    employeeId: userId,
    requestTo,
    date,
    leaveType,
    description,
  };

  const leave = new LeaveRequest(leaveRequest);
  await leave.save();

       const employeeDetails = await User.findById(userId).select("name email managerId");
    if (!employeeDetails || !employeeDetails.email)
      throw createError(400, "Employee email is missing");

    // Get manager details
    const manager = await User.findById(employeeDetails.managerId).select("name email");
    if (!manager || !manager.email)
      throw createError(400, "Manager email is missing");

    // Send email
    await sendEmail({
      from: `"${employeeDetails.name}" <${employeeDetails.email}>`,
      to: manager.email,
      subject: "New Leave Request",
      html: getLeaveRequestEmail({
        employeeName : employeeDetails.name ?? "Employee",
        managerName: manager.name ?? "Manager",
        leaveType,
        description,
        date: new Date(date).toLocaleDateString("en-US", {
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

  // Manager (logged-in user)
  const manager = await User.findById(userId).select("name email");
  if (!manager || !manager.email) {
    throw createError(400, "Manager email is missing");
  }
// Send email from manager → to employee
await sendEmail({
  from: `"${manager.name}" <${manager.email}>`,          // manager as sender
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
  const request = await LeaveRequest.find({
    employeeId: userId,
    leaveType: { $ne: "Regularization" },
  }).populate("employeeId", "name profileImage");
  res.json(request);
};

export const getSpecificDay = async (req: Request, res: Response) => {
  const { date } = req.body;
  const userId = req.user?.id;

  const start = new Date(date);
  const end = new Date(date);
  end.setDate(end.getDate() + 1);

  const dayStatus = await Attendance.findOne({
    date: { $gte: start, $lt: end },
    employeeId: userId,
  });
  if (!dayStatus) throw createError(404, "No status found");

  res.json(dayStatus);
};

export const getRegularizationRequest = async (req: Request, res: Response) => {
  const userid = req.user?.id;
  const requesst = await LeaveRequest.find({
    requestTo: userid,
    leaveType: "Regularization",
  }).populate("employeeId", "name profileImage");
  res.json(requesst);
};

export const getMyRegularization = async (req: Request, res: Response) => {
  const userid = req.user?.id;
  const requesst = await LeaveRequest.find({
    employeeId: userid,
    leaveType: "Regularization",
  });
  res.json(requesst);
};
