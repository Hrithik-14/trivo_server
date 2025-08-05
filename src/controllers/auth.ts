import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { createError } from '../helper/errorMiddleware';
import { sendMail } from '../utils/sendMail';


export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, role, phoneNumber, dateOfBirth, street, city, state, pincode, managerId } = req.body;

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

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: '24h' });

    const setPasswordLink = `${process.env.FRONTEND_URL}/set-password?token=${token}`;

    await sendMail({
        to: email,
        subject: 'Set Your Password',
        html: `
        <table class="w-full max-w-2xl mx-auto bg-white" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto;">
        <!-- Header -->
        <tr>
            <td class="bg-blue-600 p-6 text-center">
                <table class="w-full" cellpadding="0" cellspacing="0">
                    <tr>
                        <td>
                            <h1 class="text-white text-2xl font-bold m-0">TRIVO Solutions</h1>
                            <p class="text-blue-100 text-sm m-0 mt-1">Secure. Reliable. Professional.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        
        <!-- Main Content -->
        <tr>
            <td class="p-8">
                <table class="w-full" cellpadding="0" cellspacing="0">
                    <!-- Greeting -->
                    <tr>
                        <td class="pb-6">
                            <h2 class="text-2xl font-semibold text-gray-800 m-0">Hello ${name},</h2>
                        </td>
                    </tr>
                    
                    <!-- Welcome Message -->
                    <tr>
                        <td class="pb-6">
                            <p class="text-gray-600 text-base leading-6 m-0">
                                Welcome to TRIVO Solutions! We're excited to have you on board. To get started, please set up your account password by clicking the button below.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- CTA Button -->
                    <tr>
                        <td class="text-center py-8">
                            <table class="mx-auto" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <a href="${setPasswordLink}" 
                                        style="
                                            display: inline-block;
                                            padding: 12px 24px;
                                            background-color: #2563eb; /* Tailwind bg-blue-600 */
                                            color: #ffffff;
                                            text-decoration: none;
                                            font-size: 16px;
                                            border-radius: 8px;
                                            font-weight: bold;
                                        ">
                                        Set Your Password
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Additional Info -->
                    <tr>
                        <td class="py-4">
                            <table class="w-full bg-gray-50 rounded-lg" cellpadding="0" cellspacing="0" style="border-radius: 8px;">
                                <tr>
                                    <td class="p-4">
                                        <p class="text-sm text-gray-600 m-0 mb-2">
                                            <strong>Security Note:</strong> This link will expire in 24 hours for your security.
                                        </p>
                                        <p class="text-sm text-gray-600 m-0">
                                            If you didn't request this, please ignore this email or contact our support team.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        
        <!-- Footer -->
        <tr>
            <td class="bg-gray-50 p-6 border-t border-gray-200">
                <table class="w-full" cellpadding="0" cellspacing="0">
                    <tr>
                        <td class="text-center pb-4">
                            <p class="text-sm text-gray-600 m-0">
                                Questions? Contact us at 
                                <a href="mailto:group4mmjh@gmail.com" class="text-blue-600 no-underline">support@trivosolutions.com</a>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td class="text-center">
                            <p class="text-xs text-gray-500 m-0">
                                © 2025 TRIVO Solutions. All rights reserved.<br>
                                123 Business Street, City, State 12345
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>`
    });

    res.status(201).json({
        message: 'User registered successfully. Password setup link sent to email.',
        employeeCode: user.employeeCode,
    });
};


export const setPassword = async (req: Request, res: Response, next: NextFunction) => {
    const { token, password } = req.body;

    if (!token || !password) {
        return res.status(400).json({ message: 'Token and password required' });
    }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password set successfully' });
};



export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    const { identifier, password } = req.body;
    console.log(req.body);
    

    if (!identifier || !password) {
        return next(createError(400, 'Email or Employee Code and Password are required'));
    }

        const user = await User.findOne({
            $or: [{ email: identifier }, { employeeCode: identifier }]
        });

        if (!user) {
            return next(createError(404, 'User not found'));
        }

        if (!user.password) {
            return next(createError(400, 'User has no password set'));
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return next(createError(401, 'Invalid credentials'));
        }

        if (!process.env.JWT_SECRET) {
            throw new Error('Missing JWT_SECRET in environment');
        }

        const token = jwt.sign(
            { id: user._id, role: user.role, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                employeeCode: user.employeeCode,
                role: user.role,
            }
        });
};


