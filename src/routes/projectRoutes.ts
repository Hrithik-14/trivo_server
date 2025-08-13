import express from "express";
import { errorHandling } from "../helper/errorMiddleware";
import {
  addAdminProjectController,
  addManagerProjectController,
  addTaskController,
  getAllProject,
  getMemeberproject,
  getProjectById,
  getProjectByManager,
  getProjectsByMember,
  ongoingManagerProject,
  projectProgressController,
  toggleActiveController,
  updateProject,
} from "../controllers/project";
import { authMiddleware } from "../helper/authMiddleware";

const router = express.Router();

router
  .post("/admin/addAdminProject", errorHandling(addAdminProjectController))
  .get('/admin/getAllProject', errorHandling(getAllProject))
  .post("/manager/addManagerProject", errorHandling(addManagerProjectController))
  .get('/manager/:id/getProjectByManager', errorHandling(getProjectByManager))
  .post("/manager/addTask", errorHandling(addTaskController))
  .patch('/toggleActive/:id',errorHandling(toggleActiveController))
  .get('/getProjectById/:id', errorHandling(getProjectById))
  .patch('/projectProgress/:id', errorHandling(projectProgressController))
  .patch('/updateProject/:id', errorHandling(updateProject))
  .get('/managersongoing/:id', errorHandling(ongoingManagerProject))
  .get('/member/:memberId', errorHandling(getMemeberproject))
  .get('/allProject/member/:memberId', errorHandling(getProjectsByMember))

export default router;
