import { Request, Response } from 'express';
import Mail from '../models/Mail';
import { sendMail } from '../utils/sendMail';
import { adminMail } from './email';
import { User } from '../models/user';

export const createMail = async (req: Request, res: Response) => {
    try {
        const { subject, content, type, userId, designation } = req.body;
        console.log(subject);
        console.log(content);
        console.log(type);
        console.log(userId);
        
        let recipientUsers;

        if (type === 'allEmployee') {
            recipientUsers = await User.find();
        } else if (type === 'managerAndTeam') {
            const user = await User.find({ _id: userId });
            const team = await User.find({ managerId: userId });
            recipientUsers = [...user, ...team];
        } else {
            recipientUsers = await User.find({ designation });
        }

        if (!recipientUsers || recipientUsers.length === 0) {
            return res.status(400).json({ message: 'Recipients are required' });
        }

        const recipientIds = recipientUsers.map(user => user._id);

        const mails = await Mail.create({
            subject,
            content,
            type,
            recipients: recipientIds,
        });

        await mails.populate('recipients', 'email');
        const emails = mails.recipients.map((user: any) => user.email);

        await sendMail({
            to: emails.join(', '), 
            subject,
            html: adminMail({
                recipients: designation && designation.length > 0 ? designation : type,
                subject,
                content,
            }),
        });

        res.status(201).json({ message: 'Mail created and sent successfully', mails });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
