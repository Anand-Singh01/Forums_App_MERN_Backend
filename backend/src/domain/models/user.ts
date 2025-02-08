import { model, Schema } from "mongoose";

// User Schema
const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userName: { type: String, required: true, unique: true },
  dob: { type: Date, required: true },
  writtenPosts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  likedPosts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  savedPosts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  profile: { type: Schema.Types.ObjectId, ref: "Profile" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const User = model("User", userSchema);