import mongoose, { Document, Schema } from 'mongoose';

interface IMail extends Document {
    email : string[];
    subject: string;
    content: string;
    type: string
}


const mailSchema: Schema = new Schema<IMail>(
    {
        email: [{type: String, required: true}],
        subject: { type: String, required: true },
        content: { type: String, required: true },
        type: { type: String, required: true }
    }, { timestamps: true }
)

const Mail = mongoose.model<IMail>("Mail", mailSchema)
export default Mail