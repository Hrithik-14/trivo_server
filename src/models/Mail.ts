import mongoose, { Document, Schema, Types } from 'mongoose';

interface IMail extends Document {
    recipients: Types.ObjectId[];
    subject: string;
    content: string;
    type: string;
    createdAt: Date;
    updatedAt: Date;
}

const mailSchema: Schema = new Schema<IMail>(
    {
        recipients: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
        subject: { type: String, required: true },
        content: { type: String, required: true },
        type: { type: String, required: true },
    },
    { timestamps: true }
);


const Mail = mongoose.model<IMail>('Mail', mailSchema);
export default Mail;
