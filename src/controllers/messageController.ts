import { Request, Response } from "express";
import { Message } from "../models/Message";

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
            content
        });

        await message.save();

        const populatedMessage = await Message.findById(message._id)
            .populate("senderId", "name email");

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