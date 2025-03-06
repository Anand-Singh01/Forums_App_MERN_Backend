import { IReply } from "../../domain/models/reply";
import { commentDto, replyDto } from "../../domain/dto/commentsDto";
import {
  addReplyToComment,
  createCommentQuery,
  createReplyQuery,
  deleteAllReplyToAComment,
  deleteCommentQuery,
  deleteReplyQuery,
  getAllCommentsQuery,
  getAllReplyQuery,
  getCommentByIdQuery,
  getReplyByIdQuery,
  updateCommentQuery,
  updateReplyQuery,
  updateLikeStatusQuery,
} from "../../domain/queries/comment";
import { addCommentToPost } from "../../domain/queries/post";
import {
  ICommentDto,
  ICreateComment,
  ICreateReply,
  IReplyDto,
  IUpdateComment,
  IUpdateReply,
  ServiceResponse,
} from "../../util/interfaces";
import {
  populateComment,
  populateMultipleComments,
  populateMultipleReply,
  populateReply,
} from "../database/mongo/populate";
import { getPostById } from "./postRepository";
import dependencies from "../dependencies";

export const addComment = async (userId: string, data: ICreateComment) => {
  let response: ServiceResponse = {
    message: "success",
    status: true,
    statusCode: 200,
    data: null,
  };

  try {
    const post = await getPostById(data.postId);
    if (!post) {
      throw new Error("Post not found.");
    }
    const savedComment = await createCommentQuery(data, userId);
    await populateComment(savedComment);
    if (savedComment) {
      await addCommentToPost(data.postId, savedComment._id.toString());
      response.data = commentDto(savedComment);
    }
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
    const post = await getPostById(postId);
    if (!post) {
      throw new Error("Post not found.");
    }
    const comments = await getAllCommentsQuery(postId);
    await populateMultipleComments(comments);
    let modifiedComments: ICommentDto[] = [];
    comments.forEach((comment) => {
      modifiedComments.push(commentDto(comment));
    });
    response.data = modifiedComments;
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

export const updateComment = async (userId: string, data: IUpdateComment) => {
  let response: ServiceResponse = {
    message: "success",
    status: true,
    statusCode: 200,
    data: null,
  };

  try {
    const oldComment = await getCommentByIdQuery(data.commentId);
    if (!oldComment) {
      throw new Error("Comment not found.");
    }
    if (oldComment.commentedBy.toString() !== userId) {
      throw new Error("unauthorized to edit comment.");
    }
    const updatedComment = await updateCommentQuery(data);
    if (!updatedComment) {
      throw new Error("Comment not found.");
    }
    await populateComment(updatedComment);
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

export const deleteComment = async (userId: string, commentId: string) => {
  let response: ServiceResponse = {
    message: "success",
    status: true,
    statusCode: 200,
    data: null,
  };

  try {
    const comment = await getCommentByIdQuery(commentId);
    if (!comment) {
      throw new Error("Comment not found.");
    }
    if (comment.commentedBy.toString() !== userId) {
      throw new Error("unauthorized to delete comment.");
    }
    await deleteCommentQuery(commentId);
    await deleteAllReplyToAComment(commentId);
    response.data = { commentId };
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
    const comment = await getCommentByIdQuery(data.commentId);
    if (!comment) {
      throw new Error("Comment not found.");
    }
    const savedReply = await createReplyQuery(data, userId);
    await populateReply(savedReply);
    await addReplyToComment(comment, savedReply._id);
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
    const comment = await getCommentByIdQuery(commentId);
    if (!comment) {
      throw new Error("Comment not found.");
    }
    const replyList = await getAllReplyQuery(commentId);
    await populateMultipleReply(replyList);
    let modifiedReply: IReplyDto[] = [];

    replyList.forEach((item) => {
      modifiedReply.push(replyDto(item));
    });

    response.data = modifiedReply;
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

export const updateReply = async (userId: string, data: IUpdateReply) => {
  let response: ServiceResponse = {
    message: "success",
    status: true,
    statusCode: 200,
    data: null,
  };

  try {
    const oldReply = await getReplyByIdQuery(data.replyId);
    if (!oldReply) {
      throw new Error("Reply not found.");
    }
    if (oldReply.replyFrom.toString() !== userId) {
      throw new Error("unauthorized to update reply.");
    }
    const updatedReply = await updateReplyQuery(oldReply, data);
    await populateReply(updatedReply);
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

export const deleteReply = async (userId: string, replyId: string) => {
  let response: ServiceResponse = {
    message: "success",
    status: true,
    statusCode: 200,
    data: null,
  };

  try {
    const oldReply = await getReplyByIdQuery(replyId);
    if (!oldReply) {
      throw new Error("Reply not found.");
    }
    if (oldReply.replyFrom.toString() !== userId) {
      throw new Error("unauthorized to update reply.");
    }
    const deletedReply: IReply | null = await deleteReplyQuery(replyId);
    response.data = { replyId };
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