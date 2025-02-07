import {model,Schema} from "mongoose"


const profileSchema = new Schema({
    profileId: {type: Schema.Types.ObjectId, required: true},
    profileName: { type: String, required: true, default: "Profile Name" },
    profilePicture: { type: String, required: false },
    profileDesctipion: { type: String, required: false },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
  });

export const Profile = model('Profile', profileSchema);