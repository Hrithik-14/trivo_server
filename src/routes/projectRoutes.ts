import express from "express";
import { errorHandling } from "../helper/errorMiddleware";
import {
  addAdminProjectController,
  addManagerProjectController,
} from "../controllers/project";

const router = express.Router();

router
  .post("/admin/addAdminProject", errorHandling(addAdminProjectController))
  .post(
    "/manager/addManagerProject",
    errorHandling(addManagerProjectController)
  );

export default router;
