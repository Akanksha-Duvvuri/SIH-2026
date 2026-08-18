import mongoose, { Document, Schema } from "mongoose";

export type UserRole = "freelancer" | "employer";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  headline?: string;
  bio?: string;
  location?: string;
  skills: string[];
  languages: string[];
  avatar?: string;
  hourlyRate?: number;
  availability?: string;
  rating: number;
  completedProjects: number;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["freelancer", "employer"], default: "freelancer" },
    headline: String,
    bio: String,
    location: { type: String, default: "India" },
    skills: { type: [String], default: [] },
    languages: { type: [String], default: ["English"] },
    avatar: String,
    hourlyRate: { type: Number, min: 0 },
    availability: { type: String, default: "Available" },
    rating: { type: Number, default: 0 },
    completedProjects: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
