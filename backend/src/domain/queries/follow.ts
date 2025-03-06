import { Document, Types } from "mongoose";
import { IUser, User } from "../models/user";

export const followQuery = async (
  user: Document<unknown, {}, IUser> & IUser,
  friend: Document<unknown, {}, IUser> & IUser
) => {
  (user.following as Types.ObjectId[]).unshift(friend._id);
  (friend.followers as Types.ObjectId[]).unshift(user._id);
  await Promise.all([user.save(), friend.save()]);
};

export const unFollowQuery = async (
  user: Document<unknown, {}, IUser> & IUser,
  friend: Document<unknown, {}, IUser> & IUser
) => {
  user.following = (user.following as Types.ObjectId[]).filter(
    (id) => !id.equals(friend._id)
  );
  friend.followers = (friend.followers as Types.ObjectId[]).filter(
    (id) => !id.equals(user._id)
  );
  await Promise.all([user.save(), friend.save()]);
};

export const isFollowing = (user: IUser, friendId: Types.ObjectId) => {
  return (user.following as Types.ObjectId[]).some((id) => id.equals(friendId));
};

export const getFollowersListQuery = async (userId: string) => {
  return (
    await User.findById(userId).populate({
      path: "followers",
      select: "_id profile userName",
      populate: {
        path: "profile",
        select: "profilePicture",
      },
    })
  )?.followers;
};

export const getFollowingListQuery = async (userId: string) => {
  return (
    await User.findById(userId).populate({
      path: "following",
      select: "_id profile userName",
      populate: {
        path: "profile",
        select: "profilePicture",
      },
    })
  )?.following;
};