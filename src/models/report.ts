import { Schema, model, Document, Types } from "mongoose";

export type ReportStatus = "pending" | "accepted" | "rejected";

export interface IReport extends Document {
  date: Date;
  submittedBy: Types.ObjectId;
  projectId: Types.ObjectId;
  employeeId: Types.ObjectId;
  completedTasks: string[];
  plannedTasks: string[];
  descriptions: string;
  startTime: string;
  endTime: string;
  effectiveHours: number;
  performance: string;
  challenges: string;
  supportNeeded: string;
  status: ReportStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    date: { type: Date, required: true },
    submittedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project" },
    completedTasks: { type: [String], default: [] },
    plannedTasks: { type: [String], default: [] },
    descriptions: { type: String },
    startTime: {
      type: String,
      required: true,
      match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
    },
    endTime: {
      type: String,
      required: true,
      match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
    },
    effectiveHours: {
      type: Number,
      required: true,
      min: 0,
    },
    performance: { type: String, required: true },
    challenges: { type: String, required: true },
    supportNeeded: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      required: true,
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Report = model<IReport>("Report", ReportSchema);
export default Report;
