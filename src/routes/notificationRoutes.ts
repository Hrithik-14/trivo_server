import express from "express";
import { createNotification, getNotifications, markAllAsRead } from "../controllers/notificationContoller";





  const router = express.Router();

  router.post("/notification", createNotification);
  router.get("/notification/:userId", getNotifications);
  router.patch("/notification/user/:userId/read-all", markAllAsRead);

export default router;
