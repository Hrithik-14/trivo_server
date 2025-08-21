import express from 'express';
import { getAttendanceByEmployeeDate, getAttendanceChart, getAttendneceHistory, getMonthlyAttendance, getMyAttendenceHistory, markAttendance, statusAttendence, totalEmployees } from '../controllers/attendanceController';
import { errorHandling } from '../helper/errorMiddleware';
import { authMiddleware } from '../helper/authMiddleware';

let router = express.Router()

router.post('/attendance', errorHandling(markAttendance));
router.get('/attendance/:employeeId/:date', errorHandling(getAttendanceByEmployeeDate));
router.get('/attendance/:userId/', errorHandling(getAttendanceChart));
router.get('/user/:id/monthly', errorHandling(getMonthlyAttendance));
router.get('/user/attendace-history/:userId', errorHandling(getAttendneceHistory));
router.get('/getTotalEmployee',errorHandling(totalEmployees))
router.get('/statusAttendence',errorHandling(statusAttendence))
router.get('/getMyAttendenceHistory',authMiddleware,errorHandling(getMyAttendenceHistory))

export default router