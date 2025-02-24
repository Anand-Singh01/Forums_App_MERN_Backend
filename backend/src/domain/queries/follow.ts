import { Types } from "mongoose";
import { User } from "../models/user";

export const updateFollowQuery = async (userId: string, friendId: string) => {
  let message = { status: "", friendId: "" };
  const user = await User.findById(userId);
  const friend = await User.findById(friendId);
  if (!user) {
    throw new Error("Invalid userId");
  } else if (!friend) {
    throw new Error("Invalid friendId");
  }

  let userFollowingList = user.following as Types.ObjectId[];
  let friendFollowersList = friend.followers as Types.ObjectId[];

  if (userFollowingList.some((id) => id.equals(friend._id))) {
    //un-follow
    user.following = userFollowingList.filter((id) => !id.equals(friend._id));
    friend.followers = friendFollowersList.filter((id) => !id.equals(user._id));
    message = { status: "un-followed", friendId };
  } else {
    // follow
    (user.following as Types.ObjectId[]).unshift(friend._id);
    (friend.followers as Types.ObjectId[]).unshift(user._id);
    message = { status: "followed", friendId };
  }
  await Promise.all([user.save(), friend.save()]);
  return message;
};

export const getFollowersListQuery = async (userId: string) => {
  const user = await User.findById(userId).populate({
    path: "followers",
    select: "_id profile userName",
    populate: {
      path: "profile",
      select: "profilePicture",
    },
  });
  if (!user) {
    throw new Error("User not found");
  }
  return user.followers;
};

export const getFollowingListQuery = async (userId: string) => {
  const user = await User.findById(userId).populate({
    path: "following",
    select: "_id profile userName",
    populate: {
      path: "profile",
      select: "profilePicture",
    },
  });
  if (!user) {
    throw new Error("User not found");
  }
  return user.following;
};