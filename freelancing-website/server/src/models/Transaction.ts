import mongoose, { Document, Schema } from "mongoose";

export type TransactionType = "escrow-fund" | "milestone-release" | "refund";

export interface ITransaction extends Document {
  projectId: mongoose.Types.ObjectId;
  milestoneId?: mongoose.Types.ObjectId;
  type: TransactionType;
  amount: number;
  status: "completed" | "pending";
  reference: string;
  createdAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true },
    milestoneId: { type: Schema.Types.ObjectId, ref: "Milestone" },
    type: { type: String, enum: ["escrow-fund", "milestone-release", "refund"], required: true },
    amount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ["completed", "pending"], default: "completed" },
    reference: { type: String, required: true, unique: true }
  },
  { timestamps: true }
);

export const Transaction = mongoose.model<ITransaction>("Transaction", transactionSchema);
