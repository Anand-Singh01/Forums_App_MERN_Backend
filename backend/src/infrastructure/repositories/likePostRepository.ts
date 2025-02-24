import {
    getAllLikedPostsQuery,
    likePostQuery,
    unlikePostQuery,
} from "../../domain/queries/post";
import { ILikePostData, ServiceResponse } from "../../util/interfaces";

export const likePost = async (
  userId: string,
  data: ILikePostData
): Promise<ServiceResponse> => {
  let response: ServiceResponse = {
    message: "Post liked successfully",
    status: true,
    statusCode: 200,
    data: null,
  };

  try {
    const result = await likePostQuery(userId, data.postId);
    response.data = result;
  } catch (error) {
    response.status = false;
    response.message = (error as Error).message || "Unexpected error occurred";
    response.statusCode = response.statusCode || 500;
  }

  return response;
};

export const unlikePost = async (
  userId: string,
  data: ILikePostData
): Promise<ServiceResponse> => {
  let response: ServiceResponse = {
    message: "Post unliked successfully",
    status: true,
    statusCode: 200,
    data: null,
  };

  try {
    const result = await unlikePostQuery(userId, data.postId);
    response.data = result;
  } catch (error) {
    response.status = false;
    response.message = (error as Error).message || "Unexpected error occurred";
    response.statusCode = response.statusCode || 500;
  }

  return response;
};

export const getAllLikedPosts = async (
  userId: string
): Promise<ServiceResponse> => {
  let response: ServiceResponse = {
    message: "Got all liked posts successfully",
    status: true,
    statusCode: 200,
    data: null,
  };

  try {
    const user = await getAllLikedPostsQuery(userId);

    if (!user) {
      response.statusCode = 404;
      throw new Error("User not found.");
    }

    response.data = user.likedPosts;
  } catch (error) {
    response.status = false;
    response.message = (error as Error).message || "Unexpected error occurred";
    response.statusCode = response.statusCode || 500;
  }

  return response;
};