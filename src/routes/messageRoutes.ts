// routes/messageRoutes.ts
import express from "express";
import { createGroupMessage, createMessage, getGroupMessages, getMessage, markGroupMessagesAsRead } from "../controllers/messageController";
import { errorHandling } from "../helper/errorMiddleware";
import { authMiddleware } from "../helper/authMiddleware";

const router = express.Router();

router.get("/group/:groupId/messages", authMiddleware, errorHandling(getGroupMessages));
router.post("/group/:groupId/messages",authMiddleware, errorHandling(createGroupMessage));

router.get("/:recieverId/messages", authMiddleware, errorHandling(getMessage));
router.post("/:recieverId/messages",authMiddleware, errorHandling(createMessage));

router.put("/isRead/group/:groupId", authMiddleware, errorHandling(markGroupMessagesAsRead));


export default router;
