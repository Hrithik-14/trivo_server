import express from "express";
import { Server } from "socket.io";
import { createNotification, getNotifications, markAllAsRead, markAsRead } from "../controllers/notificationContoller";





  const router = express.Router();

  router.post("/notification", createNotification);
  router.get("/notification/:userId", getNotifications);
  router.patch("/notification/:id/read", markAsRead);
  router.patch("/notification/user/:userId/read-all", markAllAsRead);

export default router;
