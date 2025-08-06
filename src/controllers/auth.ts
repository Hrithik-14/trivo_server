import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { createError } from "../helper/errorMiddleware";
import { sendMail } from "../utils/sendMail";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    managerId,
    designation,
  } = req.body;
  const file = req.file;

  if (!file) return next(createError(400, "No file uploaded"));
  if (!name || !email)
    return next(createError(400, "Name and email are required"));

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createError(409, "Email already registered");
  }

  const allUsers = await User.find();
  const employeeCode = `TR/${new Date().getFullYear()}/${allUsers.length
    .toString()
    .padStart(2, "0")}`;

  const profileImageUrl = file.path;

  const user = await User.create({
    name,
    email,
    role,
    employeeCode,
    phoneNumber,
    dateOfBirth,
    designation,
    street,
    city,
    state,
    pincode,
    managerId,
    profileImage: profileImageUrl,
    password: null,
  });

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: "24h" }
  );

  const setPasswordLink = `${process.env.FRONTEND_URL}/set-password?token=${token}`;
  console.log(token);

  await sendMail({
    to: email,
    subject: "Welcome to TRIVO Solutions",
    html: `
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1); overflow: hidden;">
                
                <!-- Header with Tech gradient -->
                <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%); padding: 40px 30px; text-align: center; position: relative;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="text-align: center;">
                                    <!-- Tech company icon -->
                                    <div style="background-color: rgba(255,255,255,0.2); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px);">
                                        <img src="/logo_png.png" />
                                    </div>
                                    <h1 style="margin: 0; font-size: 32px; color: white; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                                        Welcome to TRIVO Solutions!
                                    </h1>
                                    <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 18px; font-weight: 300;">
                                        Innovation meets excellence
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                
                <tr>
                    <td style="padding: 50px 40px; background-color: #ffffff;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                                <td>
                                    <h2 style="color: #2c3e50; font-size: 24px; margin: 0 0 20px 0; font-weight: 600;">
                                        Hello Tech ${name}
                                    </h2>
                                    <p style="color: #5a6c7d; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                        Thank you for joining <strong style="color: #667eea;">TRIVO Solutions</strong>. We're excited to have you as part of our innovative tech community and look forward to building the future together!
                                    </p>
                                    
                                    <!-- Feature cards -->
                                    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                        <tr>
                                            <td style="padding: 25px; background: linear-gradient(135deg, #f8faff 0%, #e8f2ff 100%); border-radius: 12px; border-left: 4px solid #667eea;">
                                                <h3 style="color: #2c3e50; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">
                                                    What's next on your journey:
                                                </h3>
                                                <table width="100%" cellpadding="0" cellspacing="0">
                                                    <tr>
                                                        <td style="padding: 10px 0; color: #5a6c7d; font-size: 15px; line-height: 1.5;">
                                                            <span style="color: #667eea; font-weight: bold;">💻</span> 
                                                            <strong>Explore our platform</strong> - Access cutting-edge tools and resources
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="padding: 10px 0; color: #5a6c7d; font-size: 15px; line-height: 1.5;">
                                                            <span style="color: #667eea; font-weight: bold;">🔧</span> 
                                                            <strong>Set up your workspace</strong> - Customize your development environment
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="padding: 10px 0; color: #5a6c7d; font-size: 15px; line-height: 1.5;">
                                                            <span style="color: #667eea; font-weight: bold;">👥</span> 
                                                            <strong>Join our community</strong> - Connect with fellow developers and innovators
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="padding: 10px 0; color: #5a6c7d; font-size: 15px; line-height: 1.5;">
                                                            <span style="color: #667eea; font-weight: bold;">📚</span> 
                                                            <strong>Access documentation</strong> - Get started with our comprehensive guides
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                    
                                    <p style="color: #5a6c7d; font-size: 16px; line-height: 1.6; margin: 30px 0 0 0;">
                                        Need assistance? Our support team is available 24/7 to help you succeed. Just reply to this email! 💜
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                
                <!-- Stats section -->
                <tr>
                    <td style="padding: 40px; background: linear-gradient(135deg, #f8faff 0%, #ffffff 100%);">
                        <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="text-align: center; padding-bottom: 20px;">
                                    <h3 style="color: #2c3e50; font-size: 20px; margin: 0 0 25px 0; font-weight: 600;">
                                        Join thousands of innovators
                                    </h3>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <table width="100%" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td style="text-align: center; width: 33.33%; padding: 0 10px;">
                                                <div style="background-color: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                                                    <h4 style="color: #667eea; font-size: 28px; margin: 0; font-weight: 700;">10K+</h4>
                                                    <p style="color: #5a6c7d; font-size: 14px; margin: 5px 0 0 0;">Active Users</p>
                                                </div>
                                            </td>
                                            <td style="text-align: center; width: 33.33%; padding: 0 10px;">
                                                <div style="background-color: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                                                    <h4 style="color: #667eea; font-size: 28px; margin: 0; font-weight: 700;">500+</h4>
                                                    <p style="color: #5a6c7d; font-size: 14px; margin: 5px 0 0 0;">Projects</p>
                                                </div>
                                            </td>
                                            <td style="text-align: center; width: 33.33%; padding: 0 10px;">
                                                <div style="background-color: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                                                    <h4 style="color: #667eea; font-size: 28px; margin: 0; font-weight: 700;">99.9%</h4>
                                                    <p style="color: #5a6c7d; font-size: 14px; margin: 5px 0 0 0;">Uptime</p>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </tr>
                    </td>
                </tr>
                
                <!-- Social media section -->
                <tr>
                    <td style="padding: 30px 40px; background-color: #f8faff; text-align: center;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="text-align: center; padding-bottom: 20px;">
                                    <p style="color: #2c3e50; font-size: 16px; margin: 0 0 15px 0; font-weight: 600;">
                                        Stay connected with TRIVO Solutions
                                    </p>
                                    <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                                        <tr>
                                            <td style="padding: 0 10px;">
                                                <a href="#" style="display: inline-block; width: 45px; height: 45px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; text-align: center; line-height: 45px; color: white; text-decoration: none; font-size: 18px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">📘</a>
                                            </td>
                                            <td style="padding: 0 10px;">
                                                <a href="#" style="display: inline-block; width: 45px; height: 45px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; text-align: center; line-height: 45px; color: white; text-decoration: none; font-size: 18px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">💼</a>
                                            </td>
                                            <td style="padding: 0 10px;">
                                                <a href="#" style="display: inline-block; width: 45px; height: 45px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; text-align: center; line-height: 45px; color: white; text-decoration: none; font-size: 18px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">🐦</a>
                                            </td>
                                            <td style="padding: 0 10px;">
                                                <a href="#" style="display: inline-block; width: 45px; height: 45px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; text-align: center; line-height: 45px; color: white; text-decoration: none; font-size: 18px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">📧</a>
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
                    <td style="padding: 30px 40px; background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%); text-align: center; color: #bdc3c7;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="text-align: center; padding-bottom: 15px;">
                                    <p style="margin: 0; font-size: 14px; line-height: 1.5;">
                                        © 2025 TRIVO Solutions, All rights reserved.<br>
                                        <span style="color: #667eea;">Transforming ideas into reality.</span>
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td style="text-align: center; padding-top: 15px; border-top: 1px solid #495057;">
                                    <p style="margin: 0; font-size: 12px; color: #95a5a6;">
                                        You received this email because you signed up for TRIVO Solutions.<br>
                                        <a href="#" style="color: #667eea; text-decoration: none;">Unsubscribe</a> | 
                                        <a href="#" style="color: #667eea; text-decoration: none;">Privacy Policy</a> |
                                        <a href="#" style="color: #667eea; text-decoration: none;">Contact Support</a>
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        `,
  });

  await sendMail({
    to: email,
    subject: "Set Your Password",
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
    </table>`,
  });

  res.status(201).json({
    message: "User registered successfully. Password setup link sent to email.",
    employeeCode: user.employeeCode,
  });
};

export const setPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ message: "Token and password required" });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

  const user = await User.findById(decoded.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  await user.save();

  res.status(200).json({ message: "Password set successfully" });
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { identifier, password } = req.body;
  console.log(req.body);

  if (!identifier || !password) {
    return next(
      createError(400, "Email or Employee Code and Password are required")
    );
  }

  const user = await User.findOne({
    $or: [{ email: identifier }, { employeeCode: identifier }],
  });

  if (!user) {
    return next(createError(404, "User not found"));
  }

  if (!user.password) {
    return next(createError(400, "User has no password set"));
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(createError(401, "Invalid credentials"));
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("Missing JWT_SECRET in environment");
  }

  const token = jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.status(200).json({
    message: "Login successful",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      employeeCode: user.employeeCode,
      role: user.role,
    },
  });
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const users = await User.find();
  res.status(200).json({
    message: "Users fetched successfully",
    users,
  });
};

export const getAllManagers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const managers = await User.find({ role: "manager" }, { _id: 1, name: 1 });
  res.status(200).json(managers);
};

export const getAllManagersDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const managers = await User.find({ role: "manager" });
  res.status(200).json(managers);
};

export const getAllEmployees = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const managers = await User.find({ role: "employee" }, { _id: 1, name: 1 });
  res.status(200).json(managers);
};

export const getAllEmployeesDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const managers = await User.find({ role: "employee" });
  res.status(200).json(managers);
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) return next(createError(404, "Not found"));
  res.json(user);
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    managerId,
    designation,
  } = req.body;
  const { id } = req.params;

  const updatedData = {
    name,
    email,
    role,
    phoneNumber,
    dateOfBirth,
    street,
    city,
    state,
    pincode,
    managerId,
    designation,
  };

  const updatedUser = await User.findByIdAndUpdate(
    id,
    updatedData,
    {new:true}
  )

  res.status(200).json({
    message:"updated user successfully",
    sttus:"success",
    updatedUser
  })
};
