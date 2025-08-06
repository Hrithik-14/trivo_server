import { Schema, model, Document, Types } from 'mongoose';

// Interface for the User document
interface IUser extends Document {
  name?: string;
  email: string;
  employeeCode?: string;
  password: string;
  role: 'admin' | 'manager' | 'employee';
  designation?:
    | 'productmanager'
    | 'designmanager'
    | 'frontend'
    | 'backend'
    | 'tester'
    | 'seniordeveloper'
    | 'designer'
    | '';
  dateOfBirth?: Date;
  phoneNumber?: string;
  street?: string;
  city?: string;
  state?: string;
  pincode?: number;
  profileImage?: string;
  managerId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Define the User schema
const userSchema = new Schema<IUser>(
  {
    name: { type: String },
    email: { type: String, unique: true, required: true },
    employeeCode: { type: String },
    password: { type: String, required: true },
    role: {
      type: String,
      default: 'employee',
      enum: ['admin', 'manager', 'employee'],
    },
    designation: {
      type: String,
      default: '',
      enum: [
        'productmanager',
        'designmanager',
        'frontend',
        'backend',
        'tester',
        'seniordeveloper',
        'designer',
        '',
      ],
    },
    dateOfBirth: { type: Date },
    phoneNumber: { type: String },
    street: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: Number },
    profileImage: { type: String },
    managerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Create and export the User model
const User = model<IUser>('User', userSchema);
export default User;