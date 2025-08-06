import express from 'express';
import { errorHandling } from '../helper/errorMiddleware';
import { getAllEmployees, getAllEmployeesDetail, getAllManagers, getAllManagersDetail, getAllUsers, getUser, loginUser, registerUser, setPassword, updateUser } from '../controllers/auth';
import { upload } from '../helper/upload';

import { resetPassword, sendOTP, verifyOTP } from '../controllers/otpController';


const router = express.Router();



router.post('/auth/register', upload.single('profileImage'), errorHandling(registerUser));
router.post('/auth/set-password', errorHandling(setPassword));
router.post('/auth/login', errorHandling(loginUser));
router.get('/users', errorHandling(getAllUsers));
router.get('/managers', errorHandling(getAllManagers));
router.get('/managersdeatil', errorHandling(getAllManagersDetail));
router.get('/employees', errorHandling(getAllEmployees));
router.get('/employeesdeatil', errorHandling(getAllEmployeesDetail));
router.get('/users/:id', errorHandling(getUser))
router.post('/auth/send-otp',errorHandling(sendOTP))
router.post('/auth/verify-otp',errorHandling(verifyOTP))
router.post('/auth/reset-password',errorHandling(resetPassword))

export default router;  