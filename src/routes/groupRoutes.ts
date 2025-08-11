import { Router } from "express";
import { createGroup, getAllUsers, getUserGroups } from "../controllers/groupController";
import { authMiddleware } from "../helper/authMiddleware";
import { errorHandling } from "../helper/errorMiddleware";
import { upload } from "../helper/upload";

const router = Router()

router.post('/group/create', upload.single('groupImage'), authMiddleware, errorHandling(createGroup))
router.get('/group/my', authMiddleware, errorHandling(getUserGroups))
router.get("/group/users", authMiddleware, errorHandling(getAllUsers));

export default router