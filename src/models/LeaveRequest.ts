// import mongoose from "mongoose"

// const leaveShema = new mongoose.Schema({
//     employeeId: { 
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User"
//     },
//     leaveType: { type: String, enum: [] }
// })

// const LeaveRequest = mongoose.model('LeaveRequest', leaveShema)
// export default LeaveRequest

import mongoose, { Document, Schema } from 'mongoose';

// Define an interface for the LeaveRequest document
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