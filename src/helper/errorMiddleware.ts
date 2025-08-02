import { Request, Response, NextFunction } from 'express';

export interface CustomError extends Error {
    status?: number;
}

export const errorMiddleware = (
    err: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const status = err.status || 500;
    const message = err.message || 'Something went wrong';
    res.status(status).json({ message });
};

export const createError = (status: number, message: string): CustomError => {
    const err = new Error(message) as CustomError;
    err.status = status;
    return err;
};

export const errorHandling = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
    ) => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next);
    };
};
