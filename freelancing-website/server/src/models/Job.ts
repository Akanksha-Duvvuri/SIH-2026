import mongoose, { Document, Schema } from "mongoose";

export interface IJob extends Document {
  employerId: mongoose.Types.ObjectId;
  title: string;
  company: string;
  description: string;
  category: string;
  skills: string[];
  budgetMin: number;
  budgetMax: number;
  duration: string;
  experienceLevel: "Beginner" | "Intermediate" | "Expert";
  location: string;
  workMode: "Remote" | "Hybrid" | "On-site";
  applications: number;
  status: "open" | "closed" | "in-progress" | "completed";
  createdAt: Date;
}

const jobSchema = new Schema<IJob>(
  {
    employerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    skills: { type: [String], required: true },
    budgetMin: { type: Number, required: true },
    budgetMax: { type: Number, required: true },
    duration: { type: String, required: true },
    experienceLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Expert"],
      required: true
    },
    location: { type: String, default: "India" },
    workMode: {
      type: String,
      enum: ["Remote", "Hybrid", "On-site"],
      default: "Remote"
    },
    applications: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["open", "closed", "in-progress", "completed"],
      default: "open"
    }
  },
  { timestamps: true }
);

jobSchema.index({ title: "text", description: "text", skills: "text", category: "text" });
jobSchema.index({ category: 1, workMode: 1, status: 1 });

export const Job = mongoose.model<IJob>("Job", jobSchema);
