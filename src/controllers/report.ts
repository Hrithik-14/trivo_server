import { NextFunction, Request, Response } from "express";
import { createError } from "../helper/errorMiddleware";

export const createEmployReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params
  const {projectId , startTime, endTime, effectiveHours, completedTasks, plannedTasks, performance, challenges, supportNeeded} = req.body

  

};
