import { NextFunction, Request, Response } from "express";
import { Group } from "../models/Group";
import { createError } from "../helper/errorMiddleware";
import { User } from "../models/user";


export const createGroup = async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;
    let { members } = req.body;
    const createdBy = req.user?.id;
    const file = req.file

    

    if (typeof members === 'string') {
        try {
            members = JSON.parse(members);
        } catch (err) {
            return res.status(400).json({ message: "Invalid members format" });
        }
    }

    if (!name || !members || !Array.isArray(members)) {
        throw createError(400, "Invalid data");
    }

    const groupImage = file ? file.path : null;

    const newGroup = new Group({
        name,
        members,
        createdBy,
        groupImage
    });

    await newGroup.save();

    const populatedGroup = await Group.findById(newGroup._id)
        .populate("members", "name email")
        .populate("createdBy", "name email");

    res.status(201).json(populatedGroup);
};

export const getUserGroups = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        const groups = await Group.find({
            $or: [
                { members: userId },
                { createdBy: userId }
            ]
        })
            .populate("members", "name email")
            .populate("lastMessageId", "content senderId createdAt")
            .populate("createdBy", "name email")
            .sort({ updatedAt: -1 });

        res.json(groups);
    } catch (error) {
        console.error("Error fetching groups:", error);
        res.status(500).json({ message: "Failed to fetch groups" });
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find({}, "name email employeeCode");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch users" });
    }
};