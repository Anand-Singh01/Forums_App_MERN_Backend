import { postDto } from "../../domain/dto/postDto";
import {
  addPostQuery,
  deletePostQuery,
  getAllPostsQuery,
  getPostByIdQuery,
  getPostsByUserIdQuery,
  saveImageOnCloud,
  updatePostQuery,
} from "../../domain/queries/post";
import {
  IAddPostData,
  IPostDto,
  IUpdatePostData,
  ServiceResponse,
} from "../../util/interfaces";

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
    const { caption, region } = data;
    if (fileContent) {
      postImage = await saveImageOnCloud(fileContent);
    }
    if (!postImage) {
      response.statusCode = 400;
      throw new Error("image is required.");
    }
    const savedPost = await addPostQuery(caption, region, postImage, userId);
    response.data = postDto(savedPost);
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
    const post = await getPostByIdQuery(postId);
    if (!post) {
      response.statusCode = 404;
      throw new Error("post not found.");
    }
    response.data = postDto(post);
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
    const post = await getAllPostsQuery();
    let modifiedPosts: IPostDto[] = [];
    post.forEach((p) => {
      modifiedPosts.push(postDto(p));
    });
    response.data = modifiedPosts;
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
    const post = await updatePostQuery(data, fileContent);
    response.data = postDto(post);
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
    const deletedPost = await deletePostQuery(postId);
    if (!deletedPost) {
      response.statusCode = 404;
      throw new Error("Post not found.");
    }
    response.message = "Post deleted successfully";
    response.data = { postId };
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
    const posts = await getPostsByUserIdQuery(userId);
    let modifiedPosts: IPostDto[] = [];
    posts.forEach((p) => {
      modifiedPosts.push(postDto(p));
    });
    response.data = modifiedPosts;
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