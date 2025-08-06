
import express from 'express';
import { errorHandling } from '../helper/errorMiddleware';
import { loginUser, registerUser, setPassword } from '../controllers/auth';
import {  resetPassword, sendOTP, verifyOTP } from '../controllers/otpController';


const router = express.Router();


router.post('/auth/register', errorHandling(registerUser));
router.post('/auth/set-password', errorHandling(setPassword));
router.post('/auth/login', errorHandling(loginUser));
router.post('/auth/send-otp',errorHandling(sendOTP))
router.post('/auth/verify-otp',errorHandling(verifyOTP))
router.post('/auth/reset-password',errorHandling(resetPassword))


export default router;