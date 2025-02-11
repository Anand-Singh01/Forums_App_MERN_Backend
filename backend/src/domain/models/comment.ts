import { model, Schema } from "mongoose";

// Comment Schema
const commentSchema = new Schema({
  comment: { type: String, required: true },
  isEdited: { type: Boolean, default: false },
  commentedPost: { type: Schema.Types.ObjectId, ref: "Post" },
  commentedBy: { type: Schema.Types.ObjectId, ref: "User" },
  reply: [ { type: Schema.Types.ObjectId, ref: "Reply" }],
  totalReply: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Comment = model("Comment", commentSchema);