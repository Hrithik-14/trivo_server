import mongoose, { Document, Schema } from 'mongoose';

interface ILeaveRequest extends Document {
  employeeId: mongoose.Types.ObjectId;
  leaveType: 'sick' | 'casual' | 'maternity' | 'paternity' | 'other'; // Adjust as needed
}

const leaveSchema: Schema<ILeaveRequest> = new Schema<ILeaveRequest>({
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true, 
  },
  leaveType: {
    type: String,
    enum: ['sick', 'casual', 'maternity', 'paternity', 'other'], 
    required: true, 
  },
});

const LeaveRequest = mongoose.model<ILeaveRequest>('LeaveRequest', leaveSchema);
export default LeaveRequest;