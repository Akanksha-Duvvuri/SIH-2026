import mongoose, { Document, Schema } from "mongoose";

export interface IReview extends Document {
  projectId: mongoose.Types.ObjectId;
  reviewerId: mongoose.Types.ObjectId;
  revieweeId: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true },
    reviewerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    revieweeId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true, maxlength: 2000 }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

reviewSchema.index({ projectId: 1, reviewerId: 1 }, { unique: true });

export const Review = mongoose.model<IReview>("Review", reviewSchema);
