import { model, Schema, Types } from "mongoose";
import { IMessage } from "./message";
import { IUser } from "./user";

export interface IConversation extends Document {
  _id: Types.ObjectId;
  participants: Types.ObjectId[] | IUser[];
  messages: Types.ObjectId[] | IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>({
  participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
  messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Conversation = model<IConversation>(
  "Conversation",
  conversationSchema
);
