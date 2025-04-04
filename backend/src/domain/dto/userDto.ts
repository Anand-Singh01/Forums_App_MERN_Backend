import { Types } from "mongoose";
import { IRandomUserInfoDto, IUserInfoDto } from "../../util/interfaces";
import { IProfile } from "../models/profile";
import { IUser } from "../models/user";

export const toUserInfoDto = (user: IUser) => {
  const profile = user.profile as IProfile;
  return {
    userId: user._id.toString(),
    email: user.email,
    userName: user.userName,
    firstName: user.firstName,
    lastName: user.lastName,
    profileName: profile.profileName,
    profilePicture: profile.profilePicture,
    dob: user.dob,
  } as IUserInfoDto;
};

export const toRandomUserInfoDto = (currentUserId:string, user: IUser) => {
  const profile = user.profile as IProfile;
  return {
    userId: user._id.toString(),
    userName: user.userName,
    isFollowing:(user.following as Types.ObjectId[]).includes(new Types.ObjectId(currentUserId)),
    profilePicture: profile.profilePicture,
  } as IRandomUserInfoDto;
};