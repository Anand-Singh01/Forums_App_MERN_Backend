import { model, Schema, Types } from "mongoose";
import { IPost } from "./post";
import { IReply } from "./reply";
import { IUser } from "./user";

export interface IComment extends Document {
  _id: Types.ObjectId;
  comment: string;
  isEdited: boolean;
  commentedPost: Types.ObjectId | IPost;
  commentedBy: Types.ObjectId | IUser;
  reply: Types.ObjectId[] | IReply[];
  createdAt: Date;
  updatedAt: Date;
}

// Comment Schema
const commentSchema = new Schema<IComment>({
  comment: { type: String, required: true },
  isEdited: { type: Boolean, default: false },
  commentedPost: { type: Schema.Types.ObjectId, ref: "Post" },
  commentedBy: { type: Schema.Types.ObjectId, ref: "User" },
  reply: [ { type: Schema.Types.ObjectId, ref: "Reply" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Comment = model<IComment>("Comment", commentSchema);