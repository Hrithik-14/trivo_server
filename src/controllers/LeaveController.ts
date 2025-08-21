import { Request, Response } from "express";
import LeaveRequest from "../models/LeaveRequest";
import { createError } from "../helper/errorMiddleware";
import Attendance from "../models/attendance";
import { User } from "../models/user";


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
        date: leaveDate,
        leaveType,
        description,
    };

    const leave = new LeaveRequest(leaveRequest);
    await leave.save();

    res.status(201).json({ message: "Request successful", leave, approvedSickLeaves });
};




export const acceptLeaveRequest = async (req: Request, res: Response ) => {
    const { id } = req.params
    const { status, date } = req.body
    const userId = req.user?.id

    if (!['Approve', 'Reject'].includes(status)) throw createError(400, 'Invalid status value')

    const acceptRequest = await LeaveRequest.findOneAndUpdate(
        { _id:  id, requestTo: userId },
        { status },
        { new: true }
    ).populate('employeeId', 'name profileImage')
    
    if (!acceptRequest) throw createError(404, 'Leave request not found')
        
    if ( status === 'Approve' ) {
        const attendance = new Attendance({
            employeeId: acceptRequest.employeeId,
            date: date,
            status: 'absent'
        })
        await attendance.save()
    }

    res.status(200).json({message: `Leave request ${status} succesfully`, acceptRequest})
}



export const getLeaveRequest = async(req: Request, res: Response) => {
    const userId = req.user?.id
    const request = await LeaveRequest.find({ requestTo: userId, leaveType: { $ne: 'Regularization' } }).sort({ createdAt: -1 }).populate('employeeId', 'name profileImage')
    res.json(request)
}



export const getMyRequest = async (req: Request, res: Response) => {
    const userId = req.user?.id
    const request = await LeaveRequest.find({ employeeId: userId, leaveType: { $ne: 'Regularization' } }).populate('employeeId', 'name profileImage')
    res.json(request)
}



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
    const userid = req.user?.id
    const requesst = await LeaveRequest.find({ requestTo: userid, leaveType: 'Regularization' }).populate('employeeId', 'name profileImage')
    res.json(requesst)
}



export const getMyRegularization = async (req: Request, res: Response) => {
    const userid = req.user?.id
    const requesst = await LeaveRequest.find({ employeeId: userid, leaveType: 'Regularization' })
    res.json(requesst)
}