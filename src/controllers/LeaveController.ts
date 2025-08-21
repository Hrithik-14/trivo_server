import { Request, Response } from "express";
import LeaveRequest from "../models/LeaveRequest";
import { createError } from "../helper/errorMiddleware";
import Attendance from "../models/attendance";


export const createLeaveRequest = async (req: Request, res: Response) => {
    const { date, leaveType, description, requestTo } = req.body
    const userId = req.user?.id

    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);

    const existing = await LeaveRequest.findOne({ employeeId: userId,  date: { $gte: start, $lt: end } })
    if (existing) throw createError(409, 'Already requested')

    const leaveRequest = {
        employeeId: userId,
        requestTo,
        date,
        leaveType,
        description
    }

    const leave = new LeaveRequest(leaveRequest)
    await leave.save()

    res.status(201).json({ message: 'Leave Request successfull', leave })
}



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
    const { date } = req.body
    const userId = req.user?.id

    const start = new Date(date)
    const end = new Date(date)
    end.setDate(end.getDate() + 1)

    const des = await LeaveRequest.findOne({ employeeId: userId, date: { $gte: start, $lt: end } })
    const dayStatus = await Attendance.findOne({ date: { $gte: start, $lt: end }, employeeId: userId })
    if (!dayStatus) throw createError(404, 'No status found')

    res.json({dayStatus, des})
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