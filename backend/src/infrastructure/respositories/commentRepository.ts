import { Comment } from "../../domain/models/comment";
import { Post } from "../../domain/models/post";
import { Reply } from "../../domain/models/reply";
import {
  ICreateComment,
  ICreateReply,
  IUpdateComment,
  IUpdateReply,
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

export const getCommentAndReply = async (postId: string) => {
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
          path: "reply",
        },
      })
      .select("comments")
      .lean();
    if (!post) {
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

export const updateComment = async (data: IUpdateComment) => {
  let response: ServiceResponse = {
    message: "success",
    status: true,
    statusCode: 200,
    data: null,
  };

  try {
    const { comment, commentId } = data;
    const oldComment = await Comment.findById(commentId);
    if (!oldComment) {
      response.statusCode = 404;
      throw new Error("Comment not found.");
    }
    oldComment.isEdited = true;
    oldComment.comment = comment;
    const newComment = await oldComment.save();
    response.data = newComment;
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

export const updateReply = async (data: IUpdateReply) => {
  let response: ServiceResponse = {
    message: "success",
    status: true,
    statusCode: 200,
    data: null,
  };

  try {
    const { reply, replyId } = data;
    const oldReply = await Reply.findById(replyId);
    if (!oldReply) {
      response.statusCode = 404;
      throw new Error("Reply not found.");
    }
    oldReply.isEdited = true;
    oldReply.reply = reply;
    const newReply = await oldReply.save();
    response.data = newReply;
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

export const deleteComment = async (commentId: string) => {
  let response: ServiceResponse = {
    message: "success",
    status: true,
    statusCode: 200,
    data: null,
  };

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      response.statusCode = 404;
      throw new Error("Comment not found.");
    }

    // Delete the comment
    await Comment.deleteOne({ _id: comment._id });

    // Delete all replies linked to this comment
    await Reply.deleteMany({ replyToComment: comment._id });
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

export const deleteReply = async (replyId: string) => {
  let response: ServiceResponse = {
    message: "success",
    status: true,
    statusCode: 200,
    data: null,
  };

  try {
    const reply = await Reply.findById(replyId);
    if(!reply){
      response.statusCode = 404;
      throw new Error("Reply not found.");
    }
    await reply.deleteOne({_id:replyId});
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