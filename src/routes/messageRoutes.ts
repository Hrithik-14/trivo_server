import express from "express";
import { createGroupMessage, createMessage, getGroupMessages, getMessage, getUserConversations, markGroupMessagesAsRead, markPersonalMessagesAsRead } from "../controllers/messageController";
import { errorHandling } from "../helper/errorMiddleware";
import { authMiddleware } from "../helper/authMiddleware";
import { messengerUpload  } from "../helper/upload";

const router = express.Router();

router.get("/group/:groupId/messages", authMiddleware, errorHandling(getGroupMessages));
router.post("/group/:groupId/messages",authMiddleware, messengerUpload .single('file') , errorHandling(createGroupMessage));

router.get("/chat/conversations", authMiddleware, errorHandling(getUserConversations))
router.get("/chat/:recieverId/messages", authMiddleware, errorHandling(getMessage));
router.post("/chat/:recieverId/messages",authMiddleware, messengerUpload .single('file') , errorHandling(createMessage));

router.put("/isRead/group/:groupId", authMiddleware, errorHandling(markGroupMessagesAsRead));
router.put("/isRead/personal/:recieverId", authMiddleware, errorHandling(markPersonalMessagesAsRead));


export default router;
