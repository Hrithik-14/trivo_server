import express from 'express'
import { errorHandling } from '../helper/errorMiddleware'
import { createEmployReport, createManagerReport, getMyReports, getReportsByEmployee, getReportsByProject, getReportStatus, updateReportStatus } from '../controllers/report'
import { authMiddleware } from '../helper/authMiddleware'

const router = express.Router()

router.post('/report/addReport/:id',errorHandling(createEmployReport))
.get('/report/getReportsByEmployee/:id',authMiddleware,errorHandling(getReportsByEmployee))
router.get("/report/my", authMiddleware, errorHandling(getMyReports));
router.patch("/reports/:id/status", authMiddleware, errorHandling(updateReportStatus));
router.get('/getReportsByEmp/:id', errorHandling(getReportStatus))
router.post("/manager-report/:id", errorHandling(createManagerReport));
router.get('/report/getReportsByEmployee/:id',authMiddleware,errorHandling(getReportsByEmployee))
router.get("/report/project/:projectId/submittedBy/:submittedBy",errorHandling(getReportsByProject)
);


export default router