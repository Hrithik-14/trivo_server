import mongoose, { Document, Schema } from 'mongoose';

interface IMessage extends Document {
  groupId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  recieverId: mongoose.Types.ObjectId;
  readBy: mongoose.Types.ObjectId[];
  isRead: boolean;
}

const MessageSchema = new Schema<IMessage>({
  groupId: {
    type: Schema.Types.ObjectId,
    ref: 'Group',
    index: true
  },
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recieverId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  readBy: [
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    }
  ],
  isRead: {type: Boolean, default: false}
}, {
  timestamps: true
});

export const Message = mongoose.model<IMessage>('Message', MessageSchema);