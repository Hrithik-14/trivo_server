import express from 'express'
import { errorHandling } from '../helper/errorMiddleware'
import { createEmployReport, getReportsByEmployee } from '../controllers/report'
import { authMiddleware } from '../helper/authMiddleware'

const router = express.Router()

router.post('/report/addReport/:id',errorHandling(createEmployReport))
.get('/report/getReportsByEmployee/:id',authMiddleware,errorHandling(getReportsByEmployee))

export default router