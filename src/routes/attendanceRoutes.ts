import express from 'express';
import { getAttendanceByEmployeeDate, markAttendance } from '../controllers/attendanceController';
import { errorHandling } from '../helper/errorMiddleware';

let router = express.Router()

router.post('/attendance', errorHandling(markAttendance));
router.get('/attendance/:employeeId/:date', errorHandling(getAttendanceByEmployeeDate));

export default router