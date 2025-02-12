import { model, Schema } from "mongoose";

// Post Schema
const postSchema = new Schema({
  caption: { type: String, required: true },
  location: { type: String, required: false },
  postImage: { type: String, required: true },
  totalLikes: { type: Number, default: 0 },
  postedBy: { type: Schema.Types.ObjectId, ref: "User" },
  likedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  savedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Post = model("Post", postSchema);