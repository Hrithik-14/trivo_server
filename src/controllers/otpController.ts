import { Request, Response, NextFunction } from "express";
import Otp from "../models/otp";
import User from "../models/user"; // Ensure your User model is correctly imported
import { sendMail } from "../utils/sendMail";
import { createError } from "../helper/errorMiddleware";
import bcrypt from 'bcryptjs';


function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
}

export const sendOTP = async (req: Request, res: Response, next: NextFunction) => {
    const { email, employeeCode } = req.body;

    // Step 1: Find user by either employeeCode or email
    let user = null;

    if (employeeCode) {
        user = await User.findOne({ employeeCode });
    } else if (email) {
        user = await User.findOne({ email });
    }

    if (!user || !user.email) {
        throw createError(404, 'Something went wrong. User not found.');
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Remove old OTPs
    await Otp.deleteMany({ email: user.email });

    // Save new OTP
    await Otp.create({ email: user.email, otp, expiresAt });

    // HTML Email
    await sendMail({
        to: user.email,
        subject: 'Your OTP for TRIVO Solutions',
        html: `
            <table class="w-full max-w-2xl mx-auto bg-white" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto;">
                <!-- Header -->
                <tr>
                    <td class="bg-blue-600 p-6 text-center">
                        <h1 class="text-white text-2xl font-bold m-0">TRIVO Solutions</h1>
                        <p class="text-blue-100 text-sm m-0 mt-1">Secure. Reliable. Professional.</p>
                    </td>
                </tr>
                
                <!-- Main Content -->
                <tr>
                    <td class="p-8">
                        <h2 class="text-2xl font-semibold text-gray-800 m-0">Hello ${user.name || ''},</h2>
                        <p class="text-gray-600 text-base leading-6 mt-4 mb-6">
                            Your OTP for account verification is:
                        </p>
                        <div style="text-align: center; margin: 20px 0;">
                            <h1 style="color: #2563eb; font-size: 32px; letter-spacing: 4px;">${otp}</h1>
                        </div>
                        <p class="text-gray-600 text-sm leading-6">
                            This OTP will expire in <strong>5 minutes</strong>. If you did not request this, please ignore this email.
                        </p>
                    </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                    <td class="bg-gray-50 p-6 border-t border-gray-200">
                        <p class="text-sm text-gray-600 text-center">
                            Questions? Contact us at 
                            <a href="mailto:support@trivosolutions.com" class="text-blue-600 no-underline">support@trivosolutions.com</a>
                        </p>
                        <p class="text-xs text-gray-500 text-center mt-2">
                            © 2025 TRIVO Solutions. All rights reserved.<br>
                            123 Business Street, City, State 12345
                        </p>
                    </td>
                </tr>
            </table>
        `,
    });

    res.status(200).json({
        message: 'OTP sent successfully',
    });
};






export const verifyOTP = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, otp }: { email: string; otp: string } = req.body;

  if (!email || !otp) {
    return next(createError(400, "Email and OTP are required."));
  }

  const record = await Otp.findOne({ email, otp });

  if (!record) {
    return next(createError(400, "Invalid OTP"));
  }

  const now = new Date();
  if (new Date(record.expiresAt) < now) {
    await Otp.deleteMany({ email });
    return next(createError(400, "OTP has expired"));
  }

  await Otp.deleteMany({ email });

  res.status(200).json({ message: "OTP verified successfully" });
};


export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, newPassword }: { email: string; newPassword: string } = req.body;

  if (!email || !newPassword) {
    throw createError(400, "Email and new password are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw createError(404, "User not found");
  }

  const isSamePassword = await bcrypt.compare(newPassword, user.password!);
  if (isSamePassword) {
    throw createError(400, "New password must be different from the old password");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  await Otp.deleteMany({ email });

  res.status(200).json({ message: "Password reset successful" });
};
