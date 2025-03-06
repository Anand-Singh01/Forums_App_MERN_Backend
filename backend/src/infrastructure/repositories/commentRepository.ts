import { commentDto, replyDto } from "../../domain/dto/commentsDto";
import { Types } from "mongoose";
import {
  addCommentQuery,
  addReplyQuery,
  deleteCommentQuery,
  deleteReplyQuery,
  getAllCommentsQuery,
  getAllReplyQuery,
  updateCommentQuery,
  updateReplyQuery,
  updateLikeStatusQuery,
} from "../../domain/queries/comment";
import { Comment } from "../../domain/models/comment";
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
    const savedComment = await addCommentQuery(data, userId);
    response.data = commentDto(savedComment);
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

export const getAllComments = async (postId: string) => {
  let response: ServiceResponse = {
    message: "success",
    status: true,
    statusCode: 200,
    data: null,
  };

  try {
    const comments = await getAllCommentsQuery(postId);
    response.data = comments;
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
    const updatedComment = await updateCommentQuery(data);
    response.data = commentDto(updatedComment);
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
    const res = await deleteCommentQuery(commentId);
    response.data = res;
    response.message = "Comment delete successfully.";
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
    const savedReply = await addReplyQuery(data, userId);
    response.data = replyDto(savedReply);
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

export const getAllReply = async (commentId: string) => {
  let response: ServiceResponse = {
    message: "success",
    status: true,
    statusCode: 200,
    data: null,
  };

  try {
    response.data = await getAllReplyQuery(commentId);
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
    const updatedReply = await updateReplyQuery(data);
    response.data = replyDto(updatedReply);
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
    const res = await deleteReplyQuery(replyId);
    response.data = res;
    response.message = "reply deleted successfully";
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


export const updateLikeStatus = async (commentId: string, userId: string) => {
  let response: ServiceResponse = {
    message: "success",
    status: true,
    statusCode: 200,
    data: null,
  };

  try {
    // ACTIVATE query!!!
    const {liked, likedBy} = await updateLikeStatusQuery(commentId, userId);    

    // liie, no like.
    if(liked) {
      response.message = "comment liked successfully";
    } else {
      response.message = "comment unliked successfully";
    }

    response.data = {likedBy};

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