import { model, Schema, Types } from "mongoose";
import { IUser } from "./user";

export interface IReply {
  _id: Types.ObjectId;
  reply: string;
  replyToComment: Types.ObjectId | IReply;
  isEdited: boolean;
  replyFrom: Types.ObjectId | IUser;
  createdAt: Date;
  updatedAt: Date;
}

// Reply Schema
const replySchema = new Schema<IReply>({
  reply: { type: String, required: true },
  replyToComment: { type: Schema.Types.ObjectId, ref: "Comment" },
  isEdited: { type: Boolean, default: false },
  replyFrom: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Reply = model<IReply>("Reply", replySchema);