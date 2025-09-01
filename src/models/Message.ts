import mongoose, { Document, Schema } from 'mongoose';

interface IFile {
  url: string;
  name?: string;
  size?: number;
  type?: string;
  duration?: number;
}

interface IMessage extends Document {
  groupId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  recieverId: mongoose.Types.ObjectId;
  content: string;
  file?: IFile;
  type: 'text' | 'document' | 'image' | 'audio' | 'video';
  readBy: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const FileSchema = new Schema<IFile>({
  url: { type: String, required: true },
  name: { type: String },
  size: { type: Number },
  type: { type: String },
  duration: { type: Number }
}, { _id: false });

const MessageSchema = new Schema<IMessage>({
  groupId: { type: Schema.Types.ObjectId, ref: 'Group', index: true },
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  recieverId: { type: Schema.Types.ObjectId, ref: 'User' },
  content: { type: String, trim: true, maxlength: 1000 },
  file: { type: FileSchema },
  type: { 
    type: String, 
    enum: ['text', 'document', 'image', 'audio', 'video'], 
    default: 'text' 
  },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

export const Message = mongoose.model<IMessage>('Message', MessageSchema);
