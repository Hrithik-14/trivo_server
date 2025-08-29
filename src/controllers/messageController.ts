import { Request, Response } from "express";
import { Message } from "../models/Message";
import { Group } from "../models/Group";
import { User } from "../models/user";      
import mongoose from "mongoose";

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
    let fileData = null;
    if (req.file) {
      const cloudFile: any = req.file;
      fileData = {
        url: cloudFile.path,
        name: cloudFile.originalname,
        size: cloudFile.size,
        type: cloudFile.mimetype
      }
    }

    if (!senderId) {
        return res.status(400).json({ message: "Sender ID and content are required" });
    }

    try {
        const message = new Message({
            groupId,
            senderId,
            content: content || null,
            file: fileData,
            type: fileData 
              ? fileData.type.startsWith('image/')
                ? 'image'
                : fileData.type.startsWith('audio/')
                ? 'audio'
                : fileData.type.startsWith('video/')
                ? 'video'
                : 'document'
              : 'text'
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
    let fileData = null;
    if (req.file) {
      const cloudFile: any = req.file;
      fileData = {
        url: cloudFile.path,
        name: cloudFile.originalname,
        size: cloudFile.size,
        type: cloudFile.mimetype
      }
    }

    const message = new Message({
        recieverId,
        senderId,
        content: content || null,
        file: fileData,
        type: fileData 
          ? fileData.type.startsWith('image/')
            ? 'image'
            : fileData.type.startsWith('audio/')
            ? 'audio'
            : fileData.type.startsWith('video/')
            ? 'video'
            : 'document'
          : 'text'
    })
    await message.save()

    const populatedMessage = await Message.findById(message._id).populate('senderId', 'email, employeeCode')

    res.status(201).json(populatedMessage)
}

export const getMessage = async (req: Request, res: Response) => {
    const { recieverId } = req.params;
    const currentUserId = req.user?.id;

    if (!currentUserId) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    try {
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

export const markPersonalMessagesAsRead = async (req: Request, res: Response) => {
    try {
        const { recieverId } = req.params;
        const userId = req.user?.id;
        console.log('iddd',recieverId, userId);
        
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const result = await Message.updateMany(
        { senderId: new mongoose.Types.ObjectId(recieverId), readBy: { $ne: new mongoose.Types.ObjectId(userId) } },
        { $addToSet: { readBy: new mongoose.Types.ObjectId(userId) } }
        );
        console.log('Updated messages:', result.modifiedCount);

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
          groupId: { $exists: false },
          $or: [
            { senderId: currentUserObjectId },
            { recieverId: currentUserObjectId }
          ]
        }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$senderId", currentUserObjectId] },
              "$recieverId",
              "$senderId"
            ]
          },
          lastMessageTime: { $max: "$createdAt" },
          lastMessage: { $last: "$content" },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$recieverId", currentUserObjectId] },
                    { $not: { $in: [currentUserObjectId, "$readBy"] } }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo"
        }
      },
      { $unwind: "$userInfo" },
      {
        $project: {
          _id: "$userInfo._id",
          name: "$userInfo.name",
          email: "$userInfo.email",
          profileImage: "$userInfo.profileImage",
          employeeCode: "$userInfo.employeeCode",
          createdAt: "$userInfo.createdAt",
          lastMessage: 1,
          lastMessageTime: 1,
          unreadCount: 1
        }
      },
      { $sort: { lastMessageTime: -1 } }
    ]);

    res.status(200).json(conversations);
  } catch (error) {
    console.error('Error getting user conversations:', error);
    res.status(500).json({ error: 'Failed to get conversations' });
  }
};
