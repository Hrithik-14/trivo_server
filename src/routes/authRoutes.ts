import express from 'express';
import { errorHandling } from '../helper/errorMiddleware';
import { registerUser } from '../controllers/auth';

const router = express.Router();


router.post('/auth/register', errorHandling(registerUser));

export default router;
