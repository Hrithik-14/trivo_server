import { Request, Response, NextFunction } from "express";
import Otp from "../models/otp";
import User from "../models/user"; // Ensure your User model is correctly imported
import { sendMail } from "../utils/sendMail";
import { createError } from "../helper/errorMiddleware";

function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
}

export const sendOTP = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, employeeCode } = req.body;

        // Step 1: Find user by either email or employeeCode
        let user = null;

        if (employeeCode) {
            user = await User.findOne({ employeeCode });
        } else if (email) {
            user = await User.findOne({ email });
        }

        if (!user || !user.email) {
            throw createError(404, "Something went wrong. User not found.");
        }

        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

        // Remove any existing OTPs for this email
        await Otp.deleteMany({ email: user.email });

        // Save new OTP
        await Otp.create({ email: user.email, otp, expiresAt });

        // Send OTP to user's email
        await sendMail({
            to: user.email,
            subject: 'Your OTP for TRIVO Solutions',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
                    <h2>Hello ${user.name || ''},</h2>
                    <p>Your OTP for account verification is:</p>
                    <h1 style="color: #2563eb;">${otp}</h1>
                    <p>This OTP will expire in <strong>5 minutes</strong>.</p>
                    <p>If you didn’t request this, please ignore this email.</p>
                    <hr />
                    <p style="font-size: 12px; color: gray;">TRIVO Solutions</p>
                </div>
            `,
        });

        res.status(200).json({
            message: "OTP sent successfully",
        });

    } catch (error) {
        next(error);
    }
};

export const verifyOTP = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, otp }: { email: string; otp: string } = req.body;

    
    if (!email || !otp) {
      throw createError(400, "Email and OTP are required.");
    }

   
    const record = await Otp.findOne({ email, otp });

    if (!record) {
      throw createError(400, "Invalid OTP");
    }

    
    const now = new Date();
    if (new Date(record.expiresAt) < now) {
      
      await Otp.deleteMany({ email });
      throw createError(400, "OTP has expired");
    }

    
    await Otp.deleteMany({ email });

    
    res.status(200).json({ message: "OTP verified successfully" });

  } catch (error) {
    next(error);
  }
};

