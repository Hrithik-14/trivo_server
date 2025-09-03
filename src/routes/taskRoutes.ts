import express from 'express';
import {
  getTasksByProjectAndUser,
  addTaskForUser,
  deleteTask,
  updateTask,
  getTasksByProject,
} from '../controllers/taskController';
import { errorHandling } from '../helper/errorMiddleware';

const router = express.Router();

router.get('/project/:projectId/user/:memberId/tasks', errorHandling(getTasksByProjectAndUser));
router.get('/project/:projectId/tasks', errorHandling(getTasksByProject));
router.post('/tasks', errorHandling(addTaskForUser));
router.delete('/tasks/:taskId', errorHandling(deleteTask));
router.put('/tasks/:taskId', errorHandling(updateTask));

export default router;

