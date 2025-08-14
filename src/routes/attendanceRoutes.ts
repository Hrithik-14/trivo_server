import express from 'express';
import { getAttendanceByEmployeeDate, getAttendanceChart, getMonthlyAttendance, markAttendance } from '../controllers/attendanceController';
import { errorHandling } from '../helper/errorMiddleware';

let router = express.Router()

router.post('/attendance', errorHandling(markAttendance));
router.get('/attendance/:employeeId/:date', errorHandling(getAttendanceByEmployeeDate));
router.get('/attendance/:userId', errorHandling(getAttendanceChart));
router.get('/user/:id/monthly', errorHandling(getMonthlyAttendance));

export default router