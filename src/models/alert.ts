import { Schema, model, Document, Types } from "mongoose";

export interface IAlert extends Document {
  forUsers: Types.ObjectId[]; 
  message: string;
  createdAt: Date;
  image:string
  destination:string
  name:string
}

const alertSchema = new Schema<IAlert>(
  {
    forUsers: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    message: { type: String, required: true },
    image: { type: String },
    createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 } 
  },
  { timestamps: true }
);

export default model<IAlert>("Alert", alertSchema);
