import { model, Schema } from "mongoose";

// Reply Schema
const replySchema = new Schema({
  reply: { type: String, required: true },
  replyToComment: { type: Schema.Types.ObjectId, ref: "Comment" },
  isEdited: { type: Boolean, default: false },
  replyFrom: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Reply = model("Reply", replySchema);