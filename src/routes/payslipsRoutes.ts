import express from 'express'
import { errorHandling } from '../helper/errorMiddleware'
import { createPayslips, getPayslipById, getPayslips, getPayslipsByUser } from '../controllers/paylipsController'

const router = express.Router()

router.post('/payslips', errorHandling(createPayslips))
router.get('/payslips', errorHandling(getPayslips))
router.get('/payslips/user/:userId', errorHandling(getPayslipsByUser))
router.get('/payslips/:id', errorHandling(getPayslipById))

export default router