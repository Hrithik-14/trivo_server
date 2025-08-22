import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
  title: string;
  status: 'pending' | 'completed';
  assignedTo?: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  batchTime?: Date;
  estimatedHours?: number; 
}

const taskSchema: Schema<ITask> = new Schema<ITask>({
  title: {
    type: String,
    required: true,
    trim: true, 
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending',
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  batchTime: { type: Date }
});

const Task = mongoose.model<ITask>('Task', taskSchema);
export default Task;