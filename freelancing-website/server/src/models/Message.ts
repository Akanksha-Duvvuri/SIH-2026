import mongoose, { Document, Schema } from "mongoose";

export interface IMessage extends Document {
  projectId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  recipientId: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    recipientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, trim: true, maxlength: 3000 }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Message = mongoose.model<IMessage>("Message", messageSchema);
