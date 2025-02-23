import { model, Schema, Types } from "mongoose";
import { IComment } from "./comment";
import { IUser } from "./user";

export interface IPost extends Document {
  _id: Types.ObjectId;
  caption: string;
  region: string | null;
  postImage: string;
  postedBy: Types.ObjectId | IUser;
  likedBy: Types.ObjectId[] | IUser[];
  savedBy: Types.ObjectId[] | IUser[];
  comments: Types.ObjectId[] | IComment[];
  createdAt: Date;
  updatedAt: Date;
}

// Post Schema
const postSchema = new Schema<IPost>({
  caption: { type: String, required: true },
  region: { type: String, default: "" },
  postImage: { type: String, required: true },
  postedBy: { type: Schema.Types.ObjectId, ref: "User" },
  likedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  savedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Post = model<IPost>("Post", postSchema);