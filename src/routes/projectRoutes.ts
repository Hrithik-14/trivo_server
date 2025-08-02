import express from "express";
import { errorHandling } from "../helper/errorMiddleware";
import addProjectController from "../controllers/addProject";

const router = express.Router();

router.post('/admin/addProject', errorHandling(addProjectController))

export default router