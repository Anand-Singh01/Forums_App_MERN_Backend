import { Types } from "mongoose";
import {
  ICommentDto,
  ICreateComment,
  ICreateReply,
  IReplyDto,
  IUpdateComment,
  IUpdateReply,
} from "../../util/interfaces";
import { commentDto, replyDto } from "../dto/commentsDto";
import { Comment } from "../models/comment";
import { Post } from "../models/post";
import { Reply } from "../models/reply";
import { getPostByIdQuery } from "./post";

// Comment queries
export const addCommentQuery = async (data: ICreateComment, userId: string) => {
  const { comment, postId } = data;
  const post = await Post.findById(postId);
  if (!post) {
    throw new Error("Post not found.");
  }
  const newComment = new Comment({
    comment,
    commentedBy: userId,
    commentedPost: post._id,
  });
  const savedComment = await newComment.save();
  (post.comments as Types.ObjectId[]).push(savedComment._id);
  await post.save();
  return await newComment.populate({
    path: "commentedBy",
    select: "profile userName",
    populate: {
      path: "profile",
      select: "profilePicture",
    },
  });
};

export const getCommentByIdQuery = async (commentId: string) => {
  return await Comment.findById(commentId);
};

export const getAllCommentsQuery = async (postId: string) => {
  const post = await getPostByIdQuery(postId);
  if (!post) {
    throw new Error("Post not found.");
  }
  const comments = await Comment.find({ commentedPost: postId }).populate({
    path: "commentedBy",
    select: "profile userName",
    populate: {
      path: "profile",
      select: "profilePicture",
    },
  });
  let modifiedComments: ICommentDto[] = [];
  comments.forEach((comment) => {
    modifiedComments.push(commentDto(comment));
  });
  return modifiedComments;
};

export const updateCommentQuery = async (data: IUpdateComment) => {
  const { comment, commentId } = data;
  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    { $set: { comment, isEdited: true, updatedAt: new Date() } },
    { new: true }
  ).populate({
    path: "commentedBy",
    select: "profile userName",
    populate: {
      path: "profile",
      select: "profilePicture",
    },
  });
  if (!updatedComment) {
    throw new Error("Comment not found.");
  }
  return updatedComment;
};

export const deleteCommentQuery = async (commentId: string) => {
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new Error("Comment not found.");
  }

  // Delete the comment
  await Comment.deleteOne({ _id: comment._id });

  // Delete all replies linked to this comment
  await Reply.deleteMany({ replyToComment: comment._id });

  return { commentId };
};

// Reply Queries
export const addReplyQuery = async (data: ICreateReply, userId: string) => {
  const { reply, commentId } = data;
  const comment = await getCommentByIdQuery(commentId);
  if (!comment) {
    throw new Error("Comment not found.");
  }
  const newReply = new Reply({
    reply,
    replyToComment: comment._id,
    replyFrom: userId,
  });
  const savedReply = await newReply.save();
  (comment.reply as Types.ObjectId[]).push(savedReply._id);
  await comment.save();
  return await savedReply.populate({
    path: "replyFrom",
    select: "profile userName",
    populate: {
      path: "profile",
      select: "profilePicture",
    },
  });
};

export const getAllReplyQuery = async (commentId: string) => {
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new Error("Comment not found.");
  }
  const reply = await Reply.find({
    replyToComment: commentId,
  }).populate({
    path: "replyFrom",
    select: "profile userName",
    populate: {
      path: "profile",
      select: "profilePicture",
    },
  });

  let modifiedReply: IReplyDto[] = [];
  reply.forEach((item) => {
    modifiedReply.push(replyDto(item));
  });
  return modifiedReply;
};

export const updateReplyQuery = async (data: IUpdateReply) => {
  const { reply, replyId } = data;
  const oldReply = await Reply.findById(replyId);
  if (!oldReply) {
    throw new Error("Reply not found.");
  }
  oldReply.isEdited = true;
  oldReply.reply = reply;
  oldReply.updatedAt = new Date();
  await oldReply.save();
  return await oldReply.populate({
    path: "replyFrom",
    select: "profile userName",
    populate: {
      path: "profile",
      select: "profilePicture",
    },
  });
};

export const deleteReplyQuery = async (replyId: string) => {
  const reply = await Reply.findById(replyId);
  if (!reply) {
    throw new Error("Reply not found.");
  }
  await reply.deleteOne({ _id: replyId });
  return {replyId}
};