import express from 'express'
import { errorHandling } from '../helper/errorMiddleware'
import { createEmployReport, getReportsByEmployee, getReportsByProject } from '../controllers/report'
import { authMiddleware } from '../helper/authMiddleware'

const router = express.Router()

router.post('/report/addReport/:id',errorHandling(createEmployReport))
.get('/report/getReportsByEmployee/:id',authMiddleware,errorHandling(getReportsByEmployee))
router.get("/report/project/:projectId/submittedBy/:submittedBy",errorHandling(getReportsByProject)
);


export default router