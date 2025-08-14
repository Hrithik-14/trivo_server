import mongoose, { Document, Schema } from 'mongoose';

interface IGroup extends Document {
  name: string;
  members: mongoose.Types.ObjectId[];
  createdBy: mongoose.Types.ObjectId;
  lastMessageId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  groupImage: string;
}

const GroupSchema = new Schema<IGroup>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastMessageId: {
    type: Schema.Types.ObjectId,
    ref: 'Message'
  },
  groupImage: { type: String }
}, {
  timestamps: true
});

export const Group = mongoose.model<IGroup>('Group', GroupSchema);