import { ICommentDto, IReplyDto } from "../../util/interfaces";
import { IComment } from "../models/comment";
import { IProfile } from "../models/profile";
import { IReply } from "../models/reply";
import { IUser } from "../models/user";

export const commentDto = (comment: IComment) => {
  const user = comment.commentedBy as IUser;
  const profile = user.profile as IProfile;
  let res = {
    postId: comment.commentedPost._id.toString(),
    commentId: comment._id.toString(),
    comment: comment.comment,
    isEdited: comment.isEdited,
    replyCount: comment.reply.length,
    commentedBy: {
      profilePicture: profile.profilePicture,
      userId: user._id.toString(),
      userName: user.userName,
    },
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
  } as ICommentDto;
  return res;
};

export const replyDto = (reply: IReply) => {
  const user = reply.replyFrom as IUser;
  const profile = user.profile as IProfile;
  let res = {
    replyId: reply._id.toString(),
    commentId: reply.replyToComment._id.toString(),
    reply: reply.reply,
    replyBy: {
      profilePicture: profile.profilePicture,
      userId: user._id.toString(),
      userName: user.userName,
    },
    createdAt: reply.createdAt,
    updatedAt: reply.updatedAt,
    isEdited: reply.isEdited,
  } as IReplyDto;
  return res;
};