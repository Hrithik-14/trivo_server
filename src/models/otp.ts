import mongoose, { Document, Schema } from "mongoose";

export interface IOtp extends Document {
  email: string;
  otp: string;
  createdAt: Date;
  expiresAt: Date;
}

const otpSchema: Schema = new Schema<IOtp>(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: false }
);

const Otp = mongoose.model<IOtp>("Otp", otpSchema);
export default Otp;
