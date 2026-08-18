import mongoose, { Document, Schema } from "mongoose";

export type ApplicationStatus =
  | "submitted"
  | "shortlisted"
  | "accepted"
  | "rejected"
  | "withdrawn";

export interface IApplication extends Document {
  jobId: mongoose.Types.ObjectId;
  freelancerId: mongoose.Types.ObjectId;
  proposal: string;
  bidAmount: number;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<IApplication>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true, index: true },
    freelancerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    proposal: { type: String, required: true, trim: true, maxlength: 4000 },
    bidAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["submitted", "shortlisted", "accepted", "rejected", "withdrawn"],
      default: "submitted"
    }
  },
  { timestamps: true }
);

applicationSchema.index({ jobId: 1, freelancerId: 1 }, { unique: true });

export const Application = mongoose.model<IApplication>("Application", applicationSchema);
