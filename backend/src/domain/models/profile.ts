import { model, Schema } from "mongoose";

// Profile Schema
const profileSchema = new Schema({
  profileName: { type: String, required: true, default: "Profile Name" },
  profilePicture: {
    type: String,
    required: false,
    default: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png", // Generic User Icon
  },
  profileDescription: { type: String, required: false },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export const Profile = model("Profile", profileSchema);