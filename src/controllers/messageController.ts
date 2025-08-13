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

    const messages = await Message.find({ recieverId })
        .populate('senderId', 'name employeeCode')
        .sort({ createdAt: 1 })
    
    res.json( messages )
}



export const markGroupMessagesAsRead = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const result = await Message.updateMany(
      { groupId, readBy: { $ne: userId } },  // messages in this group where userId not in readBy
      { $addToSet: { readBy: userId } }      // add userId to readBy array only if not present
    );

    return res.status(200).json({ updatedCount: result.modifiedCount });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};
