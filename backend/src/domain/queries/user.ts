import { User } from "../models/user";
import bcrypt from "bcrypt";

export const getUserById = async (userId: string) => {
  return await User.findById(userId);
};
