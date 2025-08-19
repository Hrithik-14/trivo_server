import { Request, Response } from "express";
import Notification from "../models/notification";
import { Server } from "socket.io";
import { isValidObjectId } from "mongoose";

// Interface for notification payload
interface CreateNotificationBody {
  senderId: string;
  receiverId: string;
  type: string;
  action: string;
  entityId: string;
  description: string;
}

// Interface for params
interface UserIdParams {
  userId: string;
}

interface NotificationIdParams {
  id: string;
}

// Utility function for input validation
const validateObjectId = (id: string, field: string): void => {
  if (!id || !isValidObjectId(id)) {
    throw new Error(`Invalid ${field} provided`);
  }
};

const validateString = (
  value: string,
  field: string,
  maxLength?: number
): void => {
  if (!value || typeof value !== "string" || value.trim() === "") {
    throw new Error(`Invalid ${field} provided`);
  }
  if (maxLength && value.length > maxLength) {
    throw new Error(
      `${field} exceeds maximum length of ${maxLength} characters`
    );
  }
};

let ioInstance: Server;

// Setter function to inject io from server.ts
export const setIO = (io: Server) => {
  ioInstance = io;
};




export const createNotification = async (
  req: Request<{}, {}, CreateNotificationBody>,
  res: Response
) => {
  try {
   
    const { senderId, receiverId, type, action, entityId, description } = req.body;

  

    // Map default descriptions for each type
    const defaultDescriptions: Record<string, string> = {
      message: "You have new message",
      dailyReport: "You have new daily report",
      leaveRequest: "You have new leave request",
    };

    // Use provided description if exists, otherwise default based on type
    const finalDescription = description?.trim() || defaultDescriptions[type] || "";

    const notification = new Notification({
      senderId,
      receiverId,
      type,
      action,
      entityId,
      description: finalDescription,
      createdAt: new Date(),
      isRead: false,
    });

    await notification.save();

    const populatedNotification = await Notification.findById(notification._id)
      .populate("senderId", "name email")
      .lean();

    console.log("hi");

    res.status(201).json(populatedNotification);
  } catch (error: any) {
    console.error(
      `Error creating notification for sender ${req.body.senderId}:`,
      error.message
    );
    res
      .status(500)
      .json({ error: error.message || "Failed to create notification" });
  }
};

// Fetch all notifications for a user with pagination
export const getNotifications = async (
  req: Request<UserIdParams>,
  res: Response
) => {
  try {
    const { userId } = req.params;
    validateObjectId(userId, "userId");


    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ receiverId: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("senderId", "name email")
      .lean();

    const total = await Notification.countDocuments({ receiverId: userId });

    res.status(200).json({
      notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error(
      `Error fetching notifications for user ${req.params.userId}:`,
      error.message
    );
    res
      .status(500)
      .json({ error: error.message || "Failed to fetch notifications" });
  }
};

// Mark one notification as read
export const markAsRead = async (
  req: Request<NotificationIdParams>,
  res: Response
) => {
  try {
    const { id } = req.params;
    validateObjectId(id, "notificationId");

    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    // Optional: Verify user has permission to mark this notification
    // if (req.user?.id !== notification.receiverId.toString()) {
    //   return res.status(403).json({ error: "Unauthorized to mark this notification" });
    // }

    const updatedNotification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    )
      .populate("senderId", "name email")
      .lean();

    if (!updatedNotification) {
      return res.status(404).json({ error: "Failed to update notification" });
    }

    res.status(200).json(updatedNotification);
  } catch (error: any) {
    console.error(
      `Error marking notification ${req.params.id} as read:`,
      error.message
    );
    res
      .status(500)
      .json({ error: error.message || "Failed to mark notification as read" });
  }
};

// Mark all notifications as read for a user
export const markAllAsRead = async (
  req: Request<UserIdParams>,
  res: Response
) => {
  try {
    const { userId } = req.params;
    validateObjectId(userId, "userId");

   
    if (req.user?.id !== userId) {
      return res.status(403).json({ error: "Unauthorized to mark notifications for this user" });
    }

    const result = await Notification.updateMany(
      { receiverId: userId, isRead: false },
      { isRead: true }
    );

    res.status(200).json({
      message: `Marked ${result.modifiedCount} notifications as read`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error: any) {
    console.error(
      `Error marking all notifications as read for user ${req.params.userId}:`,
      error.message
    );
    res
      .status(500)
      .json({
        error: error.message || "Failed to mark all notifications as read",
      });
  }
};
