import mongoose from "mongoose";
import { IPost, Post } from "../domain/models/post";
import { IProfile, Profile } from "../domain/models/profile";
import { IUser, User } from "../domain/models/user";

export const dummyDataModelIds = {
  post1Id: new mongoose.Types.ObjectId(),
  post2Id: new mongoose.Types.ObjectId(),
  user1Id: new mongoose.Types.ObjectId(),
  profile1Id: new mongoose.Types.ObjectId(),
};

export const user1 = new User<IUser>({
  _id: new mongoose.Types.ObjectId(),
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  password: "hashedPassword123",
  userName: "johndoe",
  dob: new Date("2000-01-01"),
  conversations: [],
  following: [],
  followers: [],
  writtenPosts: [dummyDataModelIds["post1Id"], dummyDataModelIds["post2Id"]],
  likedPosts: [dummyDataModelIds["post1Id"]],
  savedPosts: [dummyDataModelIds["post2Id"]],
  profile: dummyDataModelIds["profile1Id"],
  createdAt: new Date(),
  updatedAt: new Date(),
});

export const profile1 = new Profile<IProfile>({
  _id: dummyDataModelIds["profile1Id"],
  profileDescription: "description-1",
  profileName: "profileName",
  profilePicture: "image123.jpg",
  user: dummyDataModelIds["user1Id"],
});

const post1 = new Post<IPost>({
  comments: [],
  likedBy: [],
  postedBy: dummyDataModelIds["user1Id"],
  savedBy: [],
  _id: dummyDataModelIds["post1Id"],
  caption: "My first post",
  region: "Waterloo ON",
  postImage: "image1.jpg",
  createdAt: new Date(),
  updatedAt: new Date(),
});

const post2 = new Post<IPost>({
  _id: dummyDataModelIds["post2Id"],
  comments: [],
  likedBy: [],
  postedBy: dummyDataModelIds["user1Id"],
  savedBy: [],
  caption: "Another post",
  region: "Waterloo ON",
  postImage: "image2.jpg",
  createdAt: new Date(),
  updatedAt: new Date(),
});

export const fillDummyDataInDb = async () => {
  await user1.save();
  await profile1.save();
  await post1.save();
  await post2.save();
};