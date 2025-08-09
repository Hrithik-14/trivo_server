import { Request, Response } from "express";
import Notification from "../models/notification";
import { getIO } from "../socket";


export const createNotification = async (req: Request, res: Response) => {
  try {
    const { senderId, receiverId, type, action, entityId, description } = req.body;

    const notification = await Notification.create({
      senderId,
      receiverId,
      type,
      action,
      entityId,
      description
    });


    const io = getIO();
    io.to(receiverId.toString()).emit("newNotification", notification);

    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: "Error creating notification", error });
  }
};


export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    const notifications = await Notification.find({ receiverId: userId })
      .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications", error });
  }
};

// Mark one notification as read
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndUpdate(id, { isRead: true });
    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Error marking as read", error });
  }
};

// Mark all notifications as read for a user
export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    await Notification.updateMany({ receiverId: userId }, { isRead: true });
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Error marking all as read", error });
  }
};
