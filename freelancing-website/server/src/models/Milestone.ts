import mongoose, { Document, Schema } from "mongoose";

export type MilestoneStatus = "pending" | "in-progress" | "submitted" | "revision" | "approved";

export interface IMilestone extends Document {
  projectId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  amount: number;
  dueDate?: Date;
  status: MilestoneStatus;
  deliverable?: string;
  submittedAt?: Date;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const milestoneSchema = new Schema<IMilestone>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    dueDate: Date,
    status: { type: String, enum: ["pending", "in-progress", "submitted", "revision", "approved"], default: "pending" },
    deliverable: String,
    submittedAt: Date,
    approvedAt: Date
  },
  { timestamps: true }
);

export const Milestone = mongoose.model<IMilestone>("Milestone", milestoneSchema);
