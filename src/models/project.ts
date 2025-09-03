import mongoose, { Document, Schema } from 'mongoose';

interface Member {
  _id?: mongoose.Types.ObjectId
  user:mongoose.Types.ObjectId
  isActive:boolean
}
export interface IProject extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  managerId: mongoose.Types.ObjectId;
  status: 'Ongoing' | 'Completed';
  members: Member[];
  tasks: mongoose.Types.ObjectId[];
  client: string;
  clientEmail?: string;
}

const projectSchema: Schema<IProject> = new Schema<IProject>({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    trim: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  managerId: 
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true, 
    },
  status: {
    type: String,
    enum: ['Ongoing', 'Completed'],
    default: 'Ongoing',
  },
  members: [
{    
  user:{
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    isActive: {
      type: Boolean,
      default: true,
    }
  }
  ],
  tasks: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Task',
    },
  ],
  client: {
    type: String,
    required: true,
    trim: true,
  },
  clientEmail: {
    type: String,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/, 'Please enter a valid email address'],
  },
});

const Project = mongoose.model<IProject>('Project', projectSchema);
export default Project;