import express from 'express'
import { errorHandling } from '../helper/errorMiddleware'
import { createEmployReports, createManagerReport, getAllEmployeePerformance, getMyFilteredReport, getMyReports, getReportsByEmployee, getReportsByProject, getReportStatus, updateReportStatus } from '../controllers/report'
import { authMiddleware } from '../helper/authMiddleware'

const router = express.Router()


router.post('/report/addReport/:id',errorHandling(createEmployReports))
.get('/report/getReportsByEmployee/:id',authMiddleware,errorHandling(getReportsByEmployee))
router.get("/report/my", authMiddleware, errorHandling(getMyReports));
router.get("/my-report/:userId", errorHandling(getMyFilteredReport));
router.patch("/reports/:id/status", authMiddleware, errorHandling(updateReportStatus));
router.get('/getReportsByEmp/:id', errorHandling(getReportStatus))
router.post("/manager-report/:id", errorHandling(createManagerReport));
router.get('/report/getReportsByEmployee/:id',authMiddleware,errorHandling(getReportsByEmployee))
router.get("/report/project/:projectId/submittedBy/:submittedBy",errorHandling(getReportsByProject));
router.get('/overall-performance', errorHandling(getAllEmployeePerformance))


export default router