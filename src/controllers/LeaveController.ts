import { Request, Response } from "express";
import LeaveRequest from "../models/LeaveRequest";
import { createError } from "../helper/errorMiddleware";
import Attendance from "../models/attendance";
import { acceptedleaveRequest, getLeaveRequestEmail } from "./email";
import { User } from "../models/user";
import { sendEmail } from "../utils/sendEmail";

export const createLeaveRequest = async (req: Request, res: Response) => {

    const { date, leaveType, description } = req.body;
    const userId = req.user?.id;
    let requestTo;

  const start = new Date(date);
  const end = new Date(date);
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

    if (employee.role === 'employee') {
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
