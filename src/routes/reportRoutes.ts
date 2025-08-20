import express from 'express'
import { errorHandling } from '../helper/errorMiddleware'
import { createEmployReport, createManagerReport, getAllManagerReports, getMyReports, getReportsByEmployee, getReportStatus, updateReportStatus } from '../controllers/report'
import { authMiddleware } from '../helper/authMiddleware'

const router = express.Router()

router.post('/report/addReport/:id',errorHandling(createEmployReport))
router.get('/report/getReportsByEmployee/:id',authMiddleware,errorHandling(getReportsByEmployee))
router.get("/report/my", authMiddleware, errorHandling(getMyReports));
router.patch("/reports/:id/status", authMiddleware, errorHandling(updateReportStatus));
router.get('/getReportsByEmp/:id', errorHandling(getReportStatus))
router.post("/manager-report/:id", errorHandling(createManagerReport));
router.get("/admin/getAllManagerReports", authMiddleware,errorHandling(getAllManagerReports))


export default router