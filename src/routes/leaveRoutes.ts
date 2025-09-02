import { Router } from "express";
import { authMiddleware } from "../helper/authMiddleware";
import { errorHandling } from "../helper/errorMiddleware";
import { acceptLeaveRequest, createLeaveRequest, getLeaveRequest, getMyRegularization, getMyRequest, getRegularizationRequest, getSpecificDay, totalLeaveCount } from "../controllers/LeaveController";

const router = Router()

router.post('/request-leave', authMiddleware, errorHandling(createLeaveRequest))
router.patch('/leave-status/:id', authMiddleware, errorHandling(acceptLeaveRequest))
router.get('/allrequest', authMiddleware, errorHandling(getLeaveRequest))
router.get('/get-my-request', authMiddleware, errorHandling(getMyRequest))
router.get('/singleday-status', authMiddleware, errorHandling(getSpecificDay))
router.get('/get-regularization', authMiddleware, errorHandling(getRegularizationRequest))
router.get('/get-my-regularization', authMiddleware, errorHandling(getMyRegularization))
router.get('/get-my-leave-count', authMiddleware, errorHandling(totalLeaveCount))


export default router