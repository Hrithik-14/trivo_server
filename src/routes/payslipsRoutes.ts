import express from 'express'
import { errorHandling } from '../helper/errorMiddleware'
import { createPayslips, getPayslips } from '../controllers/paylipsController'

const router = express.Router()

router.post('/payslips', errorHandling(createPayslips))
router.get('/payslips', errorHandling(getPayslips))

export default router