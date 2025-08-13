import { Request, Response } from "express";
import Payslip from "../models/Payslips";
import { User } from "../models/user";

export const createPayslips = async (req: Request, res: Response) => {
    try {
        const {
            employeeCode,
            employeeName,
            email,
            street,
            city,
            state,
            phoneNumber,
            salaryDate,
            basicSalary,
            allowance,
            bonus = 0,
            incentive = 0,
        } = req.body;

        // Validate required fields
        if (!employeeCode || !employeeName || !email || !salaryDate || !basicSalary || !allowance) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Calculate total earnings, tax (10%), and net salary
        const totalEarnings = parseFloat(basicSalary) + parseFloat(allowance) + parseFloat(bonus) + parseFloat(incentive);
        const tax = totalEarnings * 0.10; // 10% tax
        const netSalary = totalEarnings - tax;

        // Create payslip with calculated tax and net salary
        const payslipData = {
            employeeCode,
            employeeName,
            email,
            street,
            city,
            state,
            phoneNumber,
            salaryDate,
            basicSalary: parseFloat(basicSalary),
            allowance: parseFloat(allowance),
            bonus: parseFloat(bonus),
            incentive: parseFloat(incentive),
            tax,
            netSalary,
        };

        const payslip = new Payslip(payslipData);
        await payslip.save();

        res.status(201).json({ message: "Payslip saved successfully", payslip });
    } catch (error) {
        console.error("Failed to save payslip:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getPayslips = async (req: Request, res: Response) => {
    try {
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
                const user = await User.findOne({ employeeCode: payslip.employeeCode }).select("profileImage");
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
            data: payslipsWithImages,
        });
    } catch (error) {
        console.error("Payslips fetching error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};