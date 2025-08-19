import { Request, Response } from "express";
import { Message } from "../models/Message";
import { Group } from "../models/Group";

export const getGroupMessages = async (req: Request, res: Response) => {
    const { groupId } = req.params;
    try {
        
        const messages = await Message.find({ groupId })
            .populate("senderId", "name email profileImage")
            .sort({ createdAt: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch messages" });
    }
};

export const createGroupMessage = async (req: Request, res: Response) => {
    const { groupId } = req.params;
    const { senderId, content } = req.body;

    if (!content || !senderId) {
        return res.status(400).json({ message: "Sender ID and content are required" });
    }

    try {
        const message = new Message({
            groupId,
            senderId,
            content,
            isRead: false
        });

        await message.save();

        const populatedMessage = await Message.findById(message._id)
            .populate("senderId", "name email");
        
        await Group.findByIdAndUpdate(
            groupId,
            { lastMessageId: message._id },
            { new: true }
        )

        res.status(201).json(populatedMessage);
    } catch (err) {
        console.error("Error creating message:", err);
        res.status(500).json({ message: "Failed to create message" });
    }
};

export const createMessage = async (req: Request, res: Response) => {
    const { recieverId } = req.params;
    const { senderId, content } = req.body;

    const message = new Message({
        recieverId,
        senderId,
        content
    })
    await message.save()

    const populatedMessage = await Message.findById(message._id).populate('senderId', 'email, employeeCode')

    res.status(201).json(populatedMessage)
}

export const getMessage = async (req: Request, res: Response) => {
    const { recieverId } = req.params;
    const currentUserId = req.user?.id; // Assuming you have user ID from auth middleware

    if (!currentUserId) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    try {
        // Get messages where either:
        // 1. Current user sent to contact (senderId = currentUserId, recieverId = contact)
        // 2. Contact sent to current user (senderId = contact, recieverId = currentUserId)
        const messages = await Message.find({
            $or: [
                { senderId: currentUserId, recieverId: recieverId },
                { senderId: recieverId, recieverId: currentUserId }
            ]
        })
            .populate('senderId', 'name employeeCode email')
            .sort({ createdAt: 1 });
        
        res.json(messages);
    } catch (err) {
        console.error("Error fetching messages:", err);
        res.status(500).json({ message: "Failed to fetch messages" });
    }
}



export const markGroupMessagesAsRead = async (req: Request, res: Response) => {
    try {
        const { groupId } = req.params;
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const result = await Message.updateMany(
        { groupId, readBy: { $ne: userId } },
        { $addToSet: { readBy: userId } }
        );

        return res.status(200).json({ updatedCount: result.modifiedCount });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
};


export const getUserConversations = async (req: Request, res: Response) => {
  try {
    const currentUserId = req.user?.id;
    
    if (!currentUserId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const mongoose = require('mongoose');
    const currentUserObjectId = new mongoose.Types.ObjectId(currentUserId);

    const conversations = await Message.aggregate([
      {
        $match: {
          $and: [
            { groupId: { $exists: false } },
            {
              $or: [
                { senderId: currentUserObjectId },
                { recieverId: currentUserId }
              ]
            }
          ]
        }
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$senderId", currentUserObjectId] },
              then: "$recieverId",
              else: "$senderId"
            }
          },
          lastMessageTime: { $max: "$createdAt" },
          lastMessage: { $last: "$content" }
        }
      },
      {
        $addFields: {
          userObjectId: {
            $cond: {
              if: { $type: "$_id" },
              then: { $toObjectId: "$_id" },
              else: "$_id"
            }
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "userObjectId",
          foreignField: "_id",
          as: "userInfo"
        }
      },
      {
        $unwind: "$userInfo"
      },
      {
        $project: {
          _id: "$userInfo._id",
          name: "$userInfo.name",
          email: "$userInfo.email",
          profileImage: "$userInfo.profileImage",
          employeeCode: "$userInfo.employeeCode",
          createdAt: "$userInfo.createdAt",
          lastMessage: 1,
          lastMessageTime: 1
        }
      },
      {
        // Sort by last message time (most recent first)
        $sort: { lastMessageTime: -1 }
      }
    ]);

    console.log(`Found ${conversations.length} conversations for user ${currentUserId}`);
    res.status(200).json(conversations);
  } catch (error) {
    console.error('Error getting user conversations:', error);
    res.status(500).json({ error: 'Failed to get conversations' });
  }
};