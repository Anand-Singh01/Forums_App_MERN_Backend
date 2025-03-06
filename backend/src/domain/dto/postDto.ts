import { IPostDto } from "../../util/interfaces";
import { IPost } from "../models/post";
import { IProfile } from "../models/profile";
import { IUser } from "../models/user";

export const postDto = (post: IPost) => {
  const user = post.postedBy as IUser;
  const profile = user.profile as IProfile;
  let res = {
    postId: post._id.toString(),
    caption: post.caption,
    region: post.region,
    postImage: post.postImage,
    postedBy: {
      userId: user._id.toString(),
      userName: user.userName,
    },
    totalComments: post.comments.length,
    totalLikes: post.likedBy.length,
    totalSave: post.savedBy.length,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  } as IPostDto;
  return res;
};