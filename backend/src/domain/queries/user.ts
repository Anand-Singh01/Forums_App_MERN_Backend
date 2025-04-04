import { User } from "../models/user";

export const getUserById = async (userId: string) => {
  return await User.findById(userId);
};

export const getRandomUsers = async (userId: string) => {
  return await User.find({
    _id: { $ne: userId },
    followers: {
      $nin: [userId]
    }
  }).populate({
    path: "profile",
    select: "profilePicture profileName",
  });;
};

export const getGeneralUserInfo = async (userId: string) => {
  return await User.findById(userId).populate({
    path: "profile",
    select: "profilePicture",
  });;
};