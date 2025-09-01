import mongoose, { Document, Schema } from 'mongoose';

interface ILeaveRequest extends Document {
  employeeId: mongoose.Types.ObjectId;
  requestTo: mongoose.Types.ObjectId;
  leaveType: 'Sick' | 'Maternity' | 'Paternity' | 'Privilege' | 'Regularization' | 'Casual' | 'CompOff';
  status: 'Approve' | 'Reject' | 'Pending';
  date: Date;
  description: string;
}

const leaveSchema: Schema<ILeaveRequest> = new Schema<ILeaveRequest>({
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true, 
  },
  requestTo: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
  },
  leaveType: {
    type: String,
    enum: ["Sick", "Casual", "Privilege", "Regularization", "CompOff", "Paternity", "Maternity"],
    required: true, 
  },
  status: { 
    type: String,
    enum: ['Approve', 'Reject', 'Pending'],
    default: 'Pending'
  },
  date: { type: Date, required: true },
  description: { type: String }
}, {
  timestamps: true
});

const LeaveRequest = mongoose.model<ILeaveRequest>('LeaveRequest', leaveSchema);
export default LeaveRequest;