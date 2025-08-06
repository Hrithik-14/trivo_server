import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, unique: true },
    employeeCode: { type: String },
    password: { type: String },
    role: { type: String, default: 'employee', enum: ["admin", "manager", "employee"] },
    designation: { type: String, default: '', enum: ["productmanager", "designmanager", "frontend", "backend", "tester", "seniordeveloper", "designer"] },
    dateOfBirth: { type: Date },
    phoneNumber: { type: String },
    street: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: Number },
    profileImage: { type: String },
    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true })


const User = mongoose.model('User', userSchema)
export default User