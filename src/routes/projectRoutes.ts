import express from "express";
import { errorHandling } from "../helper/errorMiddleware";
import {
  addAdminProjectController,
  addManagerProjectController,
  addTaskController,
  getAllProject,
  getProjectByEmployee,
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
  .patch('/toggleActive/:id',errorHandling(toggleActiveController))
  .get('/getProjectById/:id', errorHandling(getProjectById))
  .patch('/projectProgress/:id', errorHandling(projectProgressController))
  .patch('/updateProject/:id', errorHandling(updateProject))
  .get('/getProjectByEmployee/:id', errorHandling(getProjectByEmployee))


export default router;
