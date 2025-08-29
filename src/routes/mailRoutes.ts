import { Router } from "express";
import { errorHandling } from "../helper/errorMiddleware";
import { createMail } from "../controllers/mailController";

const router = Router()

router.post('/send-mail', errorHandling(createMail))

export default router