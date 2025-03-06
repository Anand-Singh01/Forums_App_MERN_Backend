import { Types } from "mongoose";
import { User } from "../models/user";

export const searchUsers = async (userName: string) => {
    try{
    const users = await User.find({
        userName: { $regex: userName, $options: "i" }, // dont care about case
    })
    .select("_id userName profile")
    .populate({
        path: 'profile',
        select: 'profilePicture'
    });

    return users.map(user => ({
        userId: user._id,
        userName: user.userName,
        // Auto fill code, gotta check it. works!
        profile: typeof user.profile === 'object' && 'profilePicture' in user.profile ? user.profile.profilePicture : null, 
    }));
    }catch(error){
    throw new Error("Error searching for users");
}
  };

  

