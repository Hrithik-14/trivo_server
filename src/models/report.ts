import { Schema, model, Document, Types } from "mongoose";

export type ReportStatus = "pending" | "accepted" | "rejected";

export interface IReport extends Document {
  date: Date;
  submittedBy: Types.ObjectId;
  submittedTo:Types.ObjectId;
  projectId: Types.ObjectId;
  employeeId: Types.ObjectId;
  completedTasks: Types.ObjectId;
  plannedTasks: Types.ObjectId;
  descriptions: string;
  startTime: string;
  endTime: string;
  effectiveHours: string;
  performance: string;
  challenges: string;
  supportNeeded: string;
  status: ReportStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    date: { type: Date },
    submittedBy: { type: Schema.Types.ObjectId, ref: "User" },
    submittedTo:{ type: Schema.Types.ObjectId, ref: "User" },
    projectId: { type: Schema.Types.ObjectId, ref: "Project" },
    completedTasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
    plannedTasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],

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
      type: String,
      // required: true,
      min: 0,
      default: '0'
    },
    performance: { type: String },
    challenges: { type: String},
    supportNeeded: { type: String},
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Report = model<IReport>("Report", ReportSchema);
export default Report;
