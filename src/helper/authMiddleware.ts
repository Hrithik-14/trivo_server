import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) { throw new Error("JWT_SECRET not set in .env") }

interface JwtPayload {
    id: string;
    email: string;
    role?: string;
}

declare global {
    namespace Express {
        interface Request {
        user?: JwtPayload;
        }
    }
}

export const authMiddleware = ( req: Request, res: Response, next: NextFunction ) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
