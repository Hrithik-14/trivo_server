import mongoose, { Document, Schema } from 'mongoose';

interface ILeaveRequest extends Document {
  employeeId: mongoose.Types.ObjectId;
  leaveType: 'Sick' | 'Casual' | 'Maternity' | 'Paternity' | 'Privilege' | 'Regularization' | 'Other';
  status: 'Approve' | 'Reject' | 'Pending';
  date: Date;
  description: String;
}

const leaveSchema: Schema<ILeaveRequest> = new Schema<ILeaveRequest>({
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true, 
  },
  leaveType: {
    type: String,
    "enum": ["Sick", "Casual", "Maternity", "Paternity", "Privilege", "Regularization", "Other"],
    required: true, 
  },
  status: { 
    type: String,
    enum: ['Approve', 'Reject', 'Pending'],
    default: 'Pending'
  },
  date: { type: Date, required: true },
  description: { type: String }
});

const LeaveRequest = mongoose.model<ILeaveRequest>('LeaveRequest', leaveSchema);
export default LeaveRequest;