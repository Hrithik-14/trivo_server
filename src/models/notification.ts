import mongoose, { Document, Schema } from "mongoose";

export type NotificationType = "message" | "dailyReport" | "leaveRequest";
export type NotificationAction = "sent" | "accepted" | "rejected";

export interface INotification extends Document {
  senderId: mongoose.Types.ObjectId;  
  receiverId: mongoose.Types.ObjectId; 
  type: NotificationType;
  action: NotificationAction;
  entityId: mongoose.Types.ObjectId;   
  description?: string;
  isRead: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>({
  senderId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  receiverId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  type: {
    type: String,
    enum: ["message", "dailyReport", "leaveRequest"],
    required: true
  },
  action: {
    type: String,
    enum: ["sent", "accepted", "rejected"],
    required: true
  },
  entityId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  description: {
    type: String
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<INotification>("Notification", notificationSchema);
