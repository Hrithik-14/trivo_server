import express from "express";
import { errorHandling } from "../helper/errorMiddleware";
import {
  addAdminProjectController,
  addManagerProjectController,
  addTaskController,
  getAllProject,
  // getProjectByManager,
  toggleActiveController,
} from "../controllers/project";

const router = express.Router();

router
  .post("/admin/addAdminProject", errorHandling(addAdminProjectController))
  .get('/admin/getAllProject', errorHandling(getAllProject))
  .post(
    "/manager/addManagerProject",
    errorHandling(addManagerProjectController)
  )
  // .get('/manager/getProjectByManager/:id', errorHandling(getProjectByManager))
  .post("/manager/addTask", errorHandling(addTaskController))
  .patch('/manager/toggleActive/:_id',errorHandling(toggleActiveController))
export default router;
