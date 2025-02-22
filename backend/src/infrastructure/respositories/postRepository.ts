import {
  IAddPostData,
  ISavePostData,
  IUpdatePostData,
  ServiceResponse,
  ILikePostData,
} from "../../util/interfaces";
import dependencies from "../dependencies";
import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import { getAllSavedPostsQuery, savePostQuery, unsavePostQuery, getAllLikedPostsQuery, likePostQuery, unlikePostQuery } from "../../domain/queries/post";


export const addPost = async (
  userId: string,
  data: IAddPostData,
  fileContent: string | undefined
) => {
  let response: ServiceResponse = {
    message: "success",
    status: true,
    statusCode: 200,
    data: null,
  };

  try {
    let postImage: string | undefined;
    const { caption, location } = data;
    if (fileContent) {
      const myCloud = await dependencies.cloud.v2.uploader.upload(fileContent);
      postImage = myCloud.secure_url;
    }
    if (!postImage) {
      response.statusCode = 400;
      throw new Error("image is required.");
    }
    const post = new dependencies.models.Post({
      caption,
      location,
      postImage,
      postedBy: userId,
    });
    const savedPost = await post.save();
    response.data = savedPost;
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

export const getPostById = async (postId: string) => {
  let response: ServiceResponse = {
    message: "success",
    status: true,
    statusCode: 200,
    data: null,
  };

  try {
    const post = await dependencies.models.Post.findById(postId);
    if (!post) {
      response.statusCode = 404;
      throw new Error("post not found.");
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

export const getAllPosts = async () => {
  let response: ServiceResponse = {
    message: "success",
    status: true,
    statusCode: 200,
    data: null,
  };

  try {
    const post = await dependencies.models.Post.find();
    if (!post) {
      response.statusCode = 404;
      throw new Error("post not found.");
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

export const updatePost = async (
  data: IUpdatePostData,
  fileContent: string | undefined
) => {
  let response: ServiceResponse = {
    message: "success",
    status: true,
    statusCode: 200,
    data: null,
  };

  try {
    const post = await dependencies.models.Post.findById(data.postId);
    if (!post) {
      response.statusCode = 404;
      throw new Error("post not found to update.");
    }
    post.location = data.location;
    post.caption = data.caption;
    if (data.isImageUpdated && fileContent) {
      const myCloud = await dependencies.cloud.v2.uploader.upload(fileContent);
      post.postImage = myCloud.secure_url;
    } else if (data.isImageUpdated && !fileContent) {
      response.statusCode = 400;
      throw new Error("image is required to update.");
    }
    await post.save();
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

export const deletePost = async (postId: string) => {
  let response: ServiceResponse = {
    message: "success",
    status: true,
    statusCode: 200,
    data: null,
  };

  try {
    const deletedPost = await dependencies.models.Post.findByIdAndDelete(
      postId
    );
    if (!deletedPost) {
      response.statusCode = 404;
      throw new Error("Post not found.");
    }
    response.data = deletedPost;
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

export const getMyPosts = async (userId: string) => {
  let response: ServiceResponse = {
    message: "success",
    status: true,
    statusCode: 200,
    data: null,
  };

  try {
    const posts = await dependencies.models.Post.find({ postedBy: userId });
    response.data = posts;
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



export const savePost = async (userId: string, data: ISavePostData): Promise<ServiceResponse> => {
  let response: ServiceResponse = {
    message: "Post saved successfully",
    status: true,
    statusCode: 200,
    data: null,
  };

  try{
    const result = await savePostQuery(userId, data.postId);
    response.data = result;
  } catch (error) {
    response.status = false;
    response.message = (error as Error).message || "Unexpected error occurred";
    response.statusCode = response.statusCode || 500;
  }

  return response;
};



export const unsavePost = async (userId: string, data: ISavePostData): Promise<ServiceResponse> => {
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


export const getAllSavedPosts = async (userId: string): Promise<ServiceResponse> => {
  let response: ServiceResponse = {
    message: "Got all saved posts from user successfully",
    status: true,
    statusCode: 200,
    data: null,
  };

  try {
    // User Exists?
    const user = await getAllSavedPostsQuery(userId);
  
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



export const likePost = async (userId: string, data: ILikePostData): Promise<ServiceResponse> => {
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


export const unlikePost = async (userId: string, data: ILikePostData): Promise<ServiceResponse> => {
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



export const getAllLikedPosts = async (userId: string): Promise<ServiceResponse> => {
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