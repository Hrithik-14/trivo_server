import { Request, Response } from "express";
import Payslip from "../models/Payslips";
import {User} from "../models/user";

export const createPayslips = async (req: Request, res: Response) => {
    const payslipData = req.body;
    const payslip = new Payslip(payslipData);
    await payslip.save();
    res.status(201).json({ message: 'Payslip saved successfully', payslip });
}



export const getPayslips = async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const total = await Payslip.countDocuments();

        const payslips = await Payslip.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const payslipsWithImages = await Promise.all(
            payslips.map(async (payslip) => {
                const user = await User.findOne({ employeeCode: payslip.employeeCode }).select('profileImage');
                return {
                    ...payslip.toObject(),
                    profileImage: user?.profileImage || null,
                };
            })
        );

        res.json({
            total,
            page,
            totalPages: Math.ceil(total / limit),
            data: payslipsWithImages
        });
}