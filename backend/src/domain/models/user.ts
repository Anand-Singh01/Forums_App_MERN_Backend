import { model, Schema, Types } from "mongoose";
import { IPost } from "./post";
import { IProfile } from "./profile";

export interface IUser {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userName: string;
  dob: Date;
  writtenPosts: Types.ObjectId[] | IPost[];
  likedPosts: Types.ObjectId[] | IPost[];
  savedPosts: Types.ObjectId[] | IPost[];
  following: Types.ObjectId[] | IUser[];
  followers: Types.ObjectId[] | IUser[];
  profile: Types.ObjectId | IProfile;
  createdAt: Date;
  updatedAt: Date;
}

// User Schema
const userSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userName: { type: String, required: true, unique: true },
  following: [{ type: Schema.Types.ObjectId, ref: "User" }],
  followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  dob: { type: Date, required: true },
  writtenPosts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  likedPosts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  savedPosts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  profile: { type: Schema.Types.ObjectId, ref: "Profile" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const User = model<IUser>("User", userSchema);