import { IFollowerDto } from "../../util/interfaces";
import { IProfile } from "../models/profile";
import { IUser } from "../models/user";

export const followerDto = (user: IUser) => {
  const profile = user.profile as IProfile;
  let res = {
    userId: user._id.toString(),
    profilePicture: profile.profilePicture,
    userName: user.userName,
  } as IFollowerDto;
  return res;
};
