import {
  getAllLikedPostsQuery,
  savePostQuery,
  unsavePostQuery
} from "../../domain/queries/post";
import { ISavePostData, ServiceResponse } from "../../util/interfaces";

export const savePost = async (
  userId: string,
  data: ISavePostData
): Promise<ServiceResponse> => {
  let response: ServiceResponse = {
    message: "Post saved successfully",
    status: true,
    statusCode: 200,
    data: null,
  };

  try {
    const result = await savePostQuery(userId, data.postId);
    response.data = result;
  } catch (error) {
    response.status = false;
    response.message = (error as Error).message || "Unexpected error occurred";
    response.statusCode = response.statusCode || 500;
  }

  return response;
};

export const unsavePost = async (
  userId: string,
  data: ISavePostData
): Promise<ServiceResponse> => {
  let response: ServiceResponse = {
    message: "Post unsaved successfully",
    status: true,
    statusCode: 200,
    data: null,
  };

  try {
    const result = await unsavePostQuery(userId, data.postId);
    response.data = result;
  } catch (error) {
    response.status = false;
    response.message = (error as Error).message || "Unexpected error occurred";
    response.statusCode = response.statusCode || 500;
  }

  return response;
};

export const getAllSavedPosts = async (
  userId: string
): Promise<ServiceResponse> => {
  let response: ServiceResponse = {
    message: "Got all saved posts from user successfully",
    status: true,
    statusCode: 200,
    data: null,
  };

  try {
    // User Exists?
    const user = await getAllLikedPostsQuery(userId);

    if (!user) {
      response.statusCode = 404;
      throw new Error("User not found.");
    }

    response.data = user.savedPosts;
  } catch (error) {
    response.status = false;
    response.message = (error as Error).message || "Unexpected error occurred";
    response.statusCode = response.statusCode || 500;
  }

  return response;
};
