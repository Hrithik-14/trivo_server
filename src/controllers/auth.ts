import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { createError } from '../helper/errorMiddleware';
import { sendMail } from '../utils/sendMail';


export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    const {
        name,
        email,
        role,
        phoneNumber,
        dateOfBirth,
        street,
        city,
        state,
        pincode,
        managerId
    } = req.body;

    function generateEmployeeCode(users: any[]): string {
        const companyCode = 'TR';
        const year = new Date().getFullYear();
        const userCount = users.length;
        const paddedUserCount = userCount.toString().padStart(2, '0');
        return `${companyCode}/${year}/${paddedUserCount}`;
    }

    if (!name || !email) {
        throw createError(400, 'Name and email are required');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw createError(409, 'Email already registered');
    }

    const allUsers = await User.find();
    const employeeCode = generateEmployeeCode(allUsers);

    const user = await User.create({
        name,
        email,
        role,
        employeeCode,
        phoneNumber,
        dateOfBirth,
        street,
        city,
        state,
        pincode,
        managerId,
        password: null,
    });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    const setPasswordLink = `${process.env.FRONTEND_URL}/set-password?token=${token}`;

    await sendMail({
        to: email,
        subject: 'Set Your Password',
        html: `<p>Hello ${name},</p><p>Click below to set your password:</p><a href="${setPasswordLink}">Set Password</a>`
    });

    res.status(201).json({
        message: 'User registered successfully. Password setup link sent to email.',
        employeeCode: user.employeeCode,
    });
};