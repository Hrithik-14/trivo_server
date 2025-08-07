import express from "express";
import { errorHandling } from "../helper/errorMiddleware";
import {
  addAdminProjectController,
  addManagerProjectController,
  addTaskController,
  getAllProject,
  getProjectById,
  getProjectByManager,
  projectProgressController,
  toggleActiveController,
  updateProject,
} from "../controllers/project";

const router = express.Router();

router
  .post("/admin/addAdminProject", errorHandling(addAdminProjectController))
  .get('/admin/getAllProject', errorHandling(getAllProject))

  .post(
    "/manager/addManagerProject",
    errorHandling(addManagerProjectController)
  )
  .get('/manager/getProjectByManager', errorHandling(getProjectByManager))
  .post("/manager/addTask", errorHandling(addTaskController))
  .patch('/manager/toggleActive/:_id',errorHandling(toggleActiveController))
  .get('/manager/getProjectById/:id', errorHandling(getProjectById))
  .patch('/projectProgress/:id', errorHandling(projectProgressController))
  .patch('/updateProject/:id', errorHandling(updateProject))


export default router;
