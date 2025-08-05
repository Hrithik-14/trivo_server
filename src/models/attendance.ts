import mongoose from "mongoose"

const attendanceSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    date: { type: Date },
    signInTime: { type: String },
    signOutTime: { type: String },
    status: { default: 'present', enum: ["present", "absent", "late", "halfday"] }
})

const Attendance = mongoose.model('Attendance', attendanceSchema)
export default Attendance