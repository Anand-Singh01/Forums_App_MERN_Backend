import { IUserInfoDto } from "../../util/interfaces";
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