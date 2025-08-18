
// import { Socket, Server } from "socket.io";
// import { Message } from "./models/Message";

// export const socketHandler = (io: Server) => {
//     io.on("connection", (socket: Socket) => {
//         console.log("User connected", socket.id);

//         socket.on("joinGroup", (groupId: string) => {
//             socket.join(groupId);
//             console.log(`User joined group: ${groupId}`);
//         });

//         socket.on("sendMessage", async ({ groupId, senderId, content }) => {
//             try {
//                 const message = new Message({
//                     groupId,
//                     senderId,
//                     content
//                 });

//                 const savedMsg = await message.save();
//                 const populatedMsg = await savedMsg.populate("senderId", "name email");

//                 io.to(groupId).emit("newMessage", populatedMsg);
//             } catch (err) {
//                 console.error("Failed to save message", err);
//                 socket.emit("messageError", { error: "Failed to send message" });
//             }
//         });

//         socket.on("disconnect", () => {
//             console.log("User disconnected", socket.id);
//         });
//     });
// };

import { Socket, Server } from "socket.io";
import { Message } from "./models/Message";
import Notification from "./models/notification";
import { isValidObjectId } from "mongoose";

// Define interfaces for event payloads
interface JoinGroupPayload {
  groupId: string;
}

interface SendMessagePayload {
  groupId: string;
  senderId: string;
  content: string;
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

// Utility function for input validation
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
  // Track rooms per socket for cleanup
  const socketRooms = new Map<string, Set<string>>();

  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    // ===== CHAT GROUP =====
    socket.on("joinGroup", (payload: JoinGroupPayload) => {
      try {
        const { groupId } = payload;
        validateObjectId(groupId, "groupId");

        socket.join(groupId);
        // Track the room
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

        // Validate inputs
        validateObjectId(groupId, "groupId");
        validateObjectId(senderId, "senderId");
        validateString(content, "content", 1000); // Example max length

        // Ensure user is in the group
        if (!socket.rooms.has(groupId)) {
          throw new Error("User is not in the specified group");
        }

        const message = new Message({
          groupId,
          senderId,
          content,
          createdAt: new Date(),
        });

        // Save and populate in one query
        const savedMsg = await message.save();
        const populatedMsg = await Message.findById(savedMsg._id)
          .populate("senderId", "name email")
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

    // ===== NOTIFICATION SYSTEM =====
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

        // Validate inputs
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

        // Populate sender info
        const populatedNotification = await Notification.findById(notification._id)
          .populate("senderId", "name email")
          .lean();

        if (!populatedNotification) {
          throw new Error("Failed to retrieve populated notification");
        }

        io.to(receiverId.toString()).emit("newNotification", populatedNotification);
        console.log(`Notification sent to user ${receiverId} from ${senderId}`);
      } catch (err: any) {
        console.error(`Send notification error for ${socket.id}:`, err.message);
        socket.emit("notificationError", { error: err.message });
      }
    });

    // ===== DISCONNECT =====
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
      // Clean up rooms
      const rooms = socketRooms.get(socket.id);
      if (rooms) {
        rooms.forEach((room) => socket.leave(room));
        socketRooms.delete(socket.id);
      }
    });
  });
};