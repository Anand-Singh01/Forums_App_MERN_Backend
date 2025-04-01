import { Types } from "mongoose";
import { IPostDto } from "../../util/interfaces";
import { IPost } from "../models/post";
import { IProfile } from "../models/profile";
import { IUser } from "../models/user";

export const postDto = (post: IPost) => {
  const user = post.postedBy as IUser;
  const isLiked = (post.likedBy as Types.ObjectId[]).includes(user._id as Types.ObjectId);
  const profile = user.profile as IProfile;
  let res = {
    postId: post._id.toString(),
    caption: post.caption,
    region: post.region,
    postImage: post.postImage,
    isLiked:isLiked,
    postedBy: {
      userId: user._id.toString(),
      userName: user.userName,
      profileImage:profile?.profilePicture || ""
    },
    totalComments: post.comments.length,
    totalLikes: post.likedBy.length,
    totalSave: post.savedBy.length,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  } as IPostDto;
  return res;
};