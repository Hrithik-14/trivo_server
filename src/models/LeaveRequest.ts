import mongoose from "mongoose"

const leaveShema = new mongoose.Schema({
    employeeId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    leaveType: { type: String, enum: [] }
})

const LeaveRequest = mongoose.model('LeaveRequest', leaveShema)
export default LeaveRequest