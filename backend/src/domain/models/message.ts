import { model, Schema, Types } from "mongoose";
import { IUser } from "./user";

export interface IMessage extends Document {
  _id: Types.ObjectId;
  content: string;
  isEdited: boolean;
  sender: Types.ObjectId | IUser;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>({
  content: { type: String },
  isEdited: { type: Boolean, default: false },
  sender: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Message = model<IMessage>("Message", messageSchema);
