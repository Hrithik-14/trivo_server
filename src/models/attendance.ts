import mongoose, { Document, Schema } from 'mongoose';

interface IAttendance extends Document {
  employeeId: mongoose.Types.ObjectId;
  date: Date;
  signInTime?: string;
  signOutTime?: string; 
  status: 'present' | 'absent' | 'late' | 'halfday';
}


const attendanceSchema: Schema<IAttendance> = new Schema<IAttendance>({
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true, 
  },
  date: {
    type: Date,
    required: true, 
  },
  signInTime: {
    type: String,
  },
  signOutTime: {
    type: String,
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late', 'halfday'],
    default: 'absent',
  },
});

const Attendance = mongoose.model<IAttendance>('Attendance', attendanceSchema);
export default Attendance;