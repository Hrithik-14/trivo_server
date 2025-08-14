import express from 'express'
import { errorHandling } from '../helper/errorMiddleware'
import { createEmployReport, createManagerReport, getProjectByReport, getReportsByEmployee } from '../controllers/report'
import { authMiddleware } from '../helper/authMiddleware'

const router = express.Router()

router.post('/report/addReport/:id',errorHandling(createEmployReport))
.get('/report/getReportsByEmployee/:id',authMiddleware,errorHandling(getReportsByEmployee))
.post('/report/createManagerReport/:id',authMiddleware,errorHandling(createManagerReport))
.get('/getProjectByReport',errorHandling(getProjectByReport))

export default router