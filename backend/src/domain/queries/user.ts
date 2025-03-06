import { User } from "../models/user";

export const getUserById = async (userId: string) => {
  return await User.findById(userId);
};
