import { Socket, Server } from "socket.io";
import { Message } from "./models/Message";
import { Group } from "./models/Group";
import { User } from "./models/user"; 
import Notification from "./models/notification";
import { isValidObjectId } from "mongoose";

interface JoinGroupPayload {
  groupId: string;
}

interface SendMessagePayload {
  groupId: string;
  senderId: string;
  content: string;
}

interface JoinDirectChatPayload {
  userId: string;
  contactId: string;
}

interface SendDirectMessagePayload {
  senderId: string;
  recieverId: string;
  content: string;
  createdAt: string;
}

interface JoinNotificationRoomPayload {
  userId: string;
}

interface SendNotificationPayload {
  senderId: string;
  receiverId: string;
  type: string;
  action: string;
  entityId: string;
  description: string;
}

const validateObjectId = (id: string, field: string): void => {
  if (!id || !isValidObjectId(id)) {
    throw new Error(`Invalid ${field} provided`);
  }
};

const validateString = (value: string, field: string, maxLength?: number): void => {
  if (!value || typeof value !== "string" || value.trim() === "") {
    throw new Error(`Invalid ${field} provided`);
  }
  if (maxLength && value.length > maxLength) {
    throw new Error(`${field} exceeds maximum length of ${maxLength} characters`);
  }
};

export const socketHandler = (io: Server) => {
  const socketRooms = new Map<string, Set<string>>();
  const userSockets = new Map<string, string>(); 

  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("joinUser", (userId: string) => {
      try {
        validateObjectId(userId, "userId");
        
        socket.join(userId);
        userSockets.set(userId, socket.id);
        
        if (!socketRooms.has(socket.id)) {
          socketRooms.set(socket.id, new Set());
        }
        socketRooms.get(socket.id)!.add(userId);
        
        console.log(`User ${socket.id} joined personal room: ${userId}`);
      } catch (err: any) {
        console.error(`Join user room error for ${socket.id}:`, err.message);
        socket.emit("joinUserError", { error: err.message });
      }
    });

    socket.on("joinDirectChat", (payload: JoinDirectChatPayload) => {
      try {
        const { userId, contactId } = payload;
        validateObjectId(userId, "userId");
        validateObjectId(contactId, "contactId");

        const roomId = [userId, contactId].sort().join("-");
        socket.join(roomId);
        
        if (!socketRooms.has(socket.id)) {
          socketRooms.set(socket.id, new Set());
        }
        socketRooms.get(socket.id)!.add(roomId);

        console.log(`User ${socket.id} joined direct chat room: ${roomId}`);
      } catch (err: any) {
        console.error(`Join direct chat error for ${socket.id}:`, err.message);
        socket.emit("joinDirectChatError", { error: err.message });
      }
    });

    socket.on("sendDirectMessage", async (payload: SendDirectMessagePayload) => {
      try {
        const { senderId, recieverId, content } = payload;

        validateObjectId(senderId, "senderId");
        validateObjectId(recieverId, "recieverId");
        validateString(content, "content", 1000);

        const message = new Message({
          senderId,
          recieverId,
          content,
          createdAt: new Date(),
        });

        const savedMsg = await message.save();
        
        const populatedMsg = await Message.findById(savedMsg._id)
          .populate("senderId", "name email employeeCode profileImage")
          .lean();

        if (!populatedMsg) {
          throw new Error("Failed to retrieve populated message");
        }

        console.log(`Direct message saved and populated:`, populatedMsg);

        io.to(senderId).emit("newDirectMessage", populatedMsg);
        io.to(recieverId).emit("newDirectMessage", populatedMsg);
        
        const roomId = [senderId, recieverId].sort().join("-");
        io.to(roomId).emit("newDirectMessage", populatedMsg);

        console.log(`Direct message sent from ${senderId} to ${recieverId}`);
        
        try {
          const senderUser = await User.findById(senderId).select("name").lean();
          if (senderUser) {
            const notification = await Notification.create({
              senderId,
              receiverId: recieverId,
              type: "message",
              action: "sent",
              entityId: savedMsg._id,
              description: `${senderUser.name} sent you a message`,
              createdAt: new Date(),
            });

            const populatedNotification = await Notification.findById(notification._id)
              .populate("senderId", "name email")
              .lean();

            if (populatedNotification) {
              io.to(recieverId).emit("newNotification", populatedNotification);
            }
          }
        } catch (notifErr) {
          console.error("Failed to create notification for direct message:", notifErr);
        }

      } catch (err: any) {
        console.error(`Send direct message error for ${socket.id}:`, err.message);
        socket.emit("directMessageError", { error: err.message });
      }
    });

    socket.on("joinGroup", (payload: JoinGroupPayload) => {
      try {
        const { groupId } = payload;
        validateObjectId(groupId, "groupId");

        socket.join(groupId);
        if (!socketRooms.has(socket.id)) {
          socketRooms.set(socket.id, new Set());
        }
        socketRooms.get(socket.id)!.add(groupId);

        console.log(`User ${socket.id} joined group: ${groupId}`);
      } catch (err: any) {
        console.error(`Join group error for ${socket.id}:`, err.message);
        socket.emit("joinGroupError", { error: err.message });
      }
    });

    socket.on("sendMessage", async (payload: SendMessagePayload) => {
      try {
        const { groupId, senderId, content } = payload;

        validateObjectId(groupId, "groupId");
        validateObjectId(senderId, "senderId");
        validateString(content, "content", 1000);

        if (!socket.rooms.has(groupId)) {
          throw new Error("User is not in the specified group");
        }

        const message = new Message({
          groupId,
          senderId,
          content,
          createdAt: new Date(),
        });

        const savedMsg = await message.save();
        const populatedMsg = await Message.findById(savedMsg._id)
          .populate("senderId", "name email profileImage")
          .lean();

        if (!populatedMsg) {
          throw new Error("Failed to retrieve populated message");
        }

        io.to(groupId).emit("newMessage", populatedMsg);
        console.log(`Message sent to group ${groupId} by ${senderId}`);
      } catch (err: any) {
        console.error(`Send message error for ${socket.id}:`, err.message);
        socket.emit("messageError", { error: err.message });
      }
    });


    socket.on("joinNotificationRoom", (payload: JoinNotificationRoomPayload) => {
      try {
        const { userId } = payload;
        validateObjectId(userId, "userId");

        socket.join(userId);
        if (!socketRooms.has(socket.id)) {
          socketRooms.set(socket.id, new Set());
        }
        socketRooms.get(socket.id)!.add(userId);

        console.log(`User ${socket.id} joined notification room: ${userId}`);
      } catch (err: any) {
        console.error(`Join notification room error for ${socket.id}:`, err.message);
        socket.emit("joinNotificationError", { error: err.message });
      }
    });

    socket.on("sendNotification", async (payload: SendNotificationPayload) => {
      try {
        const { senderId, receiverId, type, action, entityId, description } = payload;

        validateObjectId(senderId, "senderId");
        validateObjectId(receiverId, "receiverId");
        validateObjectId(entityId, "entityId");
        validateString(type, "type", 50);
        validateString(action, "action", 50);
        validateString(description, "description", 500);

        const notification = await Notification.create({
          senderId,
          receiverId,
          type,
          action,
          entityId,
          description,
          createdAt: new Date(),
        });

        const populatedNotification = await Notification.findById(notification._id)
          .populate("senderId", "name email")
          .lean();

        if (populatedNotification) {
          io.to(receiverId.toString()).emit("newNotification", populatedNotification);
          console.log(`Notification sent to user ${receiverId} from ${senderId}`);
        }
      } catch (err: any) {
        console.error(`Send notification error for ${socket.id}:`, err.message);
        socket.emit("notificationError", { error: err.message });
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
      
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          userSockets.delete(userId);
          break;
        }
      }
      
      const rooms = socketRooms.get(socket.id);
      if (rooms) {
        rooms.forEach((room) => socket.leave(room));
        socketRooms.delete(socket.id);
      }
    });
  });
};