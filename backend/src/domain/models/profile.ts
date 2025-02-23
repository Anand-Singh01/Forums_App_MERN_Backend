import { model, Schema, Types } from "mongoose";
import { IUser } from "./user";

export interface IProfile {
  _id: Types.ObjectId;
  profileName: string;
  profilePicture: string;
  profileDescription: string;
  user: Types.ObjectId | IUser;
}

// Profile Schema
const profileSchema = new Schema<IProfile>({
  profileName: { type: String, required: true, default: "Profile Name" },
  profilePicture: { type: String, required: false },
  profileDescription: { type: String, required: false },
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

export const Profile = model<IProfile>("Profile", profileSchema);
