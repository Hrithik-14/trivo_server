import express from 'express'
import { errorHandling } from '../helper/errorMiddleware'
import { createEmployReport, getMyReports, getReportsByEmployee, updateReportStatus } from '../controllers/report'
import { authMiddleware } from '../helper/authMiddleware'

const router = express.Router()

router.post('/report/addReport/:id',errorHandling(createEmployReport))
.get('/report/getReportsByEmployee/:id',authMiddleware,errorHandling(getReportsByEmployee))
router.get("/report/my", authMiddleware, errorHandling(getMyReports));
router.patch("/reports/:id/status", authMiddleware, errorHandling(updateReportStatus));

export default router