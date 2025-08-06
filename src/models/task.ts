import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  status: 'pending' | 'completed';
  assignedTo?: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
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
});

const Task = mongoose.model<ITask>('Task', taskSchema);
export default Task;