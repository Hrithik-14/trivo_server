import { Request, Response } from "express";
import User from "../models/user";

export const searchUsers = async (req: Request, res: Response) => {
    const { query, role } = req.query;
    const filter: Record<string, any> = {};

    if (query) {
        filter.name = { $regex: query, $options: 'i' };
    }

    if (role) {
        filter.role = role;
    }

    const users = await User.find(filter);
    res.json({ users });
};