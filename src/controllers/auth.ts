import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUser, User } from "../models/user";
import { createError } from "../helper/errorMiddleware";
import { sendMail } from "../utils/sendMail";
import { Document } from "mongoose";
import Alert from "../models/alert";
import cloudinary from "../configs/cloudinary";
import fs from "fs";
import { getSetPassword, getWelcomeEmail } from "./email";

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
    return next(createError(400, `Name and email are required`));

  const existingUser = await User.findOne({ email });
  if (existingUser) throw createError(409, "Email already registered");

  const allUsers = await User.countDocuments();
  const employeeCode = `TR/${new Date().getFullYear()}/${allUsers
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
    isActive: true,
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
    html: getWelcomeEmail(name),
  });

  await sendMail({
    to: email,
    subject: "Set Your Password",
    html: getSetPassword(name, setPasswordLink),
  });


const otherUsers = await User.find({ _id: { $ne: user._id } }).select("_id");

try {
  const alert = await Alert.create({
    message: `🎉 Welcome ${user.name} to TRIVO Solutions!`,
    forUsers: otherUsers.map((u) => u._id), // array of user IDs
  });

  console.log("✅ Alert Created:", alert);
} catch (err) {
  console.error("❌ Alert creation failed:", err);
}

  

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

  if (user.isActive === false) throw createError(403, "You were blocked");

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
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const total = await User.countDocuments({ role: "manager" });
  const managers = await User.find({ role: "manager" })
    .sort({ createdAt: -1, _id: -1 })
    .skip(skip)
    .limit(limit);
  if (!managers) throw createError(404, "Managers not found");
  res
    .status(200)
    .json({ total, page, totalPages: Math.ceil(total / limit), managers });
};

export const getAllManagersDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const managers = await User.find(
    { role: "manager" },
    { _id: 1, name: 1, employeeCode: 1 }
  );
  res.status(200).json(managers);
};

export const getAllEmployeesDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const total = await User.countDocuments({ role: "employee" });
  const managers = await User.find({ role: "employee" })
    .sort({ createdAt: -1, _id: -1 })
    .skip(skip)
    .limit(limit);
  res
    .status(200)
    .json({ total, page, totalPages: Math.ceil(total / limit), managers });
};

export const getAllEmployees = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const managers = await User.find({ role: "employee" }, { _id: 1, name: 1 });
  res.status(200).json(managers);
};

export const getmanagersEmployees = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  const managerId = req.user?.id;

  const total = await User.countDocuments({
    role: "employee",
    managerId: managerId,
  });
  const managers = await User.find({ managerId: managerId })
    .sort({ createdAt: -1, _id: -1 })
    .skip(skip)
    .limit(limit);
  res
    .status(200)
    .json({ total, page, totalPages: Math.ceil(total / limit), managers });
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

export const blockUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { isActive } = req.body;

  const user = await User.findByIdAndUpdate(id, { isActive }, { new: true });

  if (!user) throw createError(404, "User not found");
  res.status(200).json(user);
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
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

    const updatedData: any = {
      name,
      email,
      role,
      phoneNumber,
      dateOfBirth,
      street,
      city,
      state,
      pincode,
      designation,
    };
    if (req.file) {
      const localPath = req.file.path;

      const result = await cloudinary.uploader.upload(localPath, {
        folder: "users",
      });

      updatedData.profileImage = result.secure_url;

      if (fs.existsSync(localPath)) {
        fs.unlinkSync(localPath);
      }
    }

    if (role === "Employee" && managerId && managerId !== "") {
      updatedData.managerId = managerId;
    } else {
      updatedData.$unset = { managerId: 1 };
    }

    const updatedUser = await User.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Updated user successfully",
      status: "success",
      updatedUser,
    });
  } catch (err: any) {
    console.error("Update user error:", err);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

export const getUsersRegistered = async (req: Request, res: Response) => {
  const users = await User.find(
    {},
    { _id: 1, name: 1, employeeCode: 1 }
  ).lean();

  const resData = users.map((user) => ({
    id: user._id.toString(),
    name: user.name,
    employeeCode: user.employeeCode,
  }));

  res.json(resData);
};
