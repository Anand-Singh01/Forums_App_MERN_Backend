import { Document, Types } from "mongoose";
import {
  ICreateComment,
  ICreateReply,
  IUpdateComment,
  IUpdateReply,
} from "../../util/interfaces";
import { Comment, IComment } from "../models/comment";
import { IReply, Reply } from "../models/reply";

// Comment queries
export const createCommentQuery = async (
  data: ICreateComment,
  userId: string
) => {
  const { comment, postId } = data;
  const newComment = new Comment({
    comment,
    commentedBy: userId,
    commentedPost: postId,
  });
  return await newComment.save();
};

export const getAllCommentsQuery = async (postId: string) => {
  const comments = await Comment.find({ commentedPost: postId });
  return comments;
};

export const getCommentByIdQuery = async (commentId: string) => {
  return await Comment.findById(commentId);
};

export const updateCommentQuery = async (data: IUpdateComment) => {
  const { comment, commentId } = data;
  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    { $set: { comment, isEdited: true, updatedAt: new Date() } },
    { new: true }
  );
  return updatedComment;
};

export const deleteCommentQuery = async (commentId: string) => {
  // Delete the comment
  await Comment.deleteOne({ _id: commentId });
  return { commentId };
};

export const deleteAllReplyToAComment = async (commentId: string) => {
  await Reply.deleteMany({ replyToComment: commentId });
};

// Reply Queries
export const createReplyQuery = async (data: ICreateReply, userId: string) => {
  const { reply, commentId } = data;
  const newReply = new Reply({
    reply,
    replyToComment: commentId,
    replyFrom: userId,
  });
  return await newReply.save();
};

export const addReplyToComment = async (
  comment: Document<unknown, {}, IComment> & IComment,
  replyId: Types.ObjectId
) => {
  (comment.reply as Types.ObjectId[]).push(replyId);
  await comment.save();
};

export const getAllReplyQuery = async (commentId: string) => {
  const reply = await Reply.find({
    replyToComment: commentId,
  });
  return reply;
};

export const getReplyByIdQuery = async (replyId: string) => {
  return await Reply.findById(replyId);
};

export const updateReplyQuery = async (
  oldReply: Document<unknown, {}, IReply> & IReply,
  data: IUpdateReply
) => {
  const { reply } = data;
  oldReply.isEdited = true;
  oldReply.reply = reply;
  oldReply.updatedAt = new Date();
  return await oldReply.save();
};

export const deleteReplyQuery = async (replyId: string) => {
  return await Reply.findByIdAndDelete(replyId);
};

export const updateLikeStatusQuery = async (commentId: string, userId: string) => {
  // find comment by id
  const comment = await Comment.findById(commentId);
  // exists?
  if (!comment) {
    throw new Error("Comment not found.");
  }

  let liked = false; 

  // Already liked by user?
  if ((comment.likedBy as Types.ObjectId[]).includes(new Types.ObjectId(userId))) {
    // if alreadt liked, unlike it
    comment.likedBy = (comment.likedBy as Types.ObjectId[]).filter((id: Types.ObjectId) => id.toString() !== userId);
  } else {
    // if not liked, like it
    (comment.likedBy as Types.ObjectId[]).push(new Types.ObjectId(userId));
    liked = true; // LIKED!
  }
  
  await comment.save();
  return { liked, likedBy: comment.likedBy };
};