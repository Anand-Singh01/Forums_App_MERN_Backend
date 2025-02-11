import { Comment } from "../../domain/models/comment";
import { Post } from "../../domain/models/post";
import { Reply } from "../../domain/models/reply";
import {
  ICreateComment,
  ICreateReply,
  ServiceResponse,
} from "../../util/interfaces";

export const addComment = async (userId: string, data: ICreateComment) => {
  let response: ServiceResponse = {
    message: "success",
    status: true,
    statusCode: 200,
    data: null,
  };

  try {
    const { comment, postId } = data;
    const post = await Post.findById(postId);
    if (!post) {
      response.statusCode = 404;
      throw new Error("Post not found.");
    }

    const newComment = new Comment({
      comment,
      commentedBy: userId,
      commentedPost: post._id,
    });
    const savedComment = await newComment.save();
    post.comments.push(savedComment._id);
    await post.save();
  } catch (error) {
    response.status = false;
    response.message = (error as Error).message || "unexpected error occurred";
    if (!response.statusCode || response.statusCode === 200) {
      response.statusCode = 500;
    }
    response.data = null;
  }
  return response;
};

export const addReply = async (userId: string, data: ICreateReply) => {
  let response: ServiceResponse = {
    message: "success",
    status: true,
    statusCode: 200,
    data: null,
  };

  try {
    const { reply, postId, commentId } = data;
    const post = await Post.findById(postId);
    const comment = await Comment.findById(commentId);
    if (!post) {
      response.statusCode = 404;
      throw new Error("Post not found.");
    } else if (!comment) {
      response.statusCode = 404;
      throw new Error("Comment not found.");
    }
    const newReply = new Reply({
      reply,
      replyToComment: comment._id,
      replyFrom: userId,
    });
    const savedReply = await newReply.save();
    comment.reply.push(savedReply._id);
    await comment.save();
  } catch (error) {
    response.status = false;
    response.message = (error as Error).message || "unexpected error occurred";
    if (!response.statusCode || response.statusCode === 200) {
      response.statusCode = 500;
    }
    response.data = null;
  }
  return response;
};

export const getCommentAndReply = async (postId:string) => {
  let response: ServiceResponse = {
    message: "success",
    status: true,
    statusCode: 200,
    data: null,
  };

  try {
    const post = await Post.findById(postId)
  .populate({
    path: "comments",
    populate: {
      path: "reply"
    },
  }).select('comments')
  .lean();  
    if(!post){
      response.statusCode = 404;
      throw new Error("Post not found.");
    }
    response.data = post;
  } catch (error) {
    response.status = false;
    response.message = (error as Error).message || "unexpected error occurred";
    if (!response.statusCode || response.statusCode === 200) {
      response.statusCode = 500;
    }
    response.data = null;
  }
  return response;
};