import mongoose, { model, Model, Models } from "mongoose";


export interface IFeedback extends Document {
    header: string;
    description: string;
    user: mongoose.Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
  }

const feedbackSchema = new mongoose.Schema(
  {
    header: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Feedback = model<IFeedback>("Feedback", feedbackSchema);