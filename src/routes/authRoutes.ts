import express from 'express';
import { errorHandling } from '../helper/errorMiddleware';
import { loginUser, registerUser, setPassword } from '../controllers/auth';

const router = express.Router();


router.post('/auth/register', errorHandling(registerUser));
router.post('/auth/set-password', errorHandling(setPassword));
router.post('/auth/login', errorHandling(loginUser));

export default router;