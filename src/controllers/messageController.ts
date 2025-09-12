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
        return res.status(400).json({ message: "Sender ID is required" });
    }

    if (!content && !fileData) {
        return res.status(400).json({ message: "Content or file is required" });
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
            .populate("senderId", "name email profileImage");
        
        if (!populatedMessage) {
            return res.status(500).json({ message: "Failed to retrieve created message" });
        }

        await Group.findByIdAndUpdate(
            groupId,
            { lastMessageId: message._id },
            { new: true }
        );

        const io = req.app.get('io');
        if (io) {
            console.log(`Broadcasting group message to group: ${groupId}`);
            
            io.to(groupId).emit("newMessage", populatedMessage);
            
            try {
                const group = await Group.findById(groupId).populate('members createdBy', '_id');
                if (group) {
                    const allMemberIds = [
                        ...group.members.map(m => m._id.toString()),
                        group.createdBy._id.toString()
                    ];
                    
                    allMemberIds.forEach(memberId => {
                        if (memberId !== senderId) {
                            io.to(memberId).emit("newMessage", populatedMessage);
                        }
                    });
                    
                    console.log(`Group message broadcasted to ${allMemberIds.length} members`);
                }
            } catch (memberError) {
                console.error("Error broadcasting to individual members:", memberError);
            }
        } else {
            console.warn("Socket.io not available for group message broadcast");
        }

        res.status(201).json(populatedMessage);
    } catch (err) {
        console.error("Error creating group message:", err);
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

    if (!senderId) {
        return res.status(400).json({ message: "Sender ID is required" });
    }

    if (!content && !fileData) {
        return res.status(400).json({ message: "Content or file is required" });
    }

    try {
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
        });
        
        await message.save();

        const populatedMessage = await Message.findById(message._id)
            .populate('senderId', 'name email employeeCode profileImage');

        if (!populatedMessage) {
            return res.status(500).json({ message: "Failed to retrieve created message" });
        }

        const io = req.app.get('io');
        if (io) {
            console.log(`Broadcasting direct message from ${senderId} to ${recieverId}`);
            
            const roomId = [senderId, recieverId].sort().join("-");
            
            io.to(roomId).emit("newDirectMessage", populatedMessage);
            console.log(`Emitted to direct chat room: ${roomId}`);
            
            io.to(senderId).emit("newDirectMessage", populatedMessage);
            io.to(recieverId).emit("newDirectMessage", populatedMessage);
            console.log(`Emitted to personal rooms: ${senderId}, ${recieverId}`);
            
            const sockets = await io.fetchSockets();
            const connectedUsers = sockets.map((s: any) => Array.from(s.rooms));
            console.log(`Connected sockets rooms:`, connectedUsers.length);
            
            console.log(`Direct message broadcasted successfully`);
        } else {
            console.warn("Socket.io not available for direct message broadcast");
        }

        res.status(201).json(populatedMessage);
    } catch (err) {
        console.error("Error creating direct message:", err);
        res.status(500).json({ message: "Failed to create message" });
    }
};

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
            .populate('senderId', 'name employeeCode email profileImage')
            .sort({ createdAt: 1 });
        
        console.log(`Retrieved ${messages.length} messages between ${currentUserId} and ${recieverId}`);
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

        console.log(`Marked ${result.modifiedCount} group messages as read for user ${userId}`);
        return res.status(200).json({ updatedCount: result.modifiedCount });
    } catch (err) {
        console.error("Error marking group messages as read:", err);
        return res.status(500).json({ error: 'Server error' });
    }
};

export const markPersonalMessagesAsRead = async (req: Request, res: Response) => {
    try {
        const { recieverId } = req.params;
        const userId = req.user?.id;
        console.log('Marking personal messages as read:', { recieverId, userId });
        
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const result = await Message.updateMany(
            { 
                senderId: new mongoose.Types.ObjectId(recieverId), 
                recieverId: new mongoose.Types.ObjectId(userId),
                readBy: { $ne: new mongoose.Types.ObjectId(userId) } 
            },
            { $addToSet: { readBy: new mongoose.Types.ObjectId(userId) } }
        );
        
        console.log(`Marked ${result.modifiedCount} personal messages as read`);
        return res.status(200).json({ updatedCount: result.modifiedCount });
    } catch (err) {
        console.error("Error marking personal messages as read:", err);
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
                    lastFile: { $last: "$file" },
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
                    lastMessage: {
                        $cond: [
                            { $ne: ["$lastMessage", null] },
                            "$lastMessage",
                            { $ifNull: ["$lastFile.name", "Start a conversation"] }
                        ]
                    },
                    lastMessageTime: 1,
                    unreadCount: 1
                }
            },
            { $sort: { lastMessageTime: -1 } }
        ]);

        console.log(`Retrieved ${conversations.length} conversations for user ${currentUserId}`);
        res.status(200).json(conversations);
    } catch (error) {
        console.error('Error getting user conversations:', error);
        res.status(500).json({ error: 'Failed to get conversations' });
    }
};