import {
  addPostQuery,
  deletePostQuery,
  getAllPostsQuery,
  getPostByPostIdQuery,
  getPostsByUserIdQuery,
  saveImageOnCloud,
  updatePostQuery,
} from "../../domain/queries/post";
import {
  IAddPostData,
  ISavePostData,
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
    const { caption, location } = data;
    if (fileContent) {
      postImage = await saveImageOnCloud(fileContent);
    }
    if (!postImage) {
      response.statusCode = 400;
      throw new Error("image is required.");
    }
    const savedPost = await addPostQuery(caption, location, postImage, userId);
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
    const post = await getPostByPostIdQuery(postId);
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
    const post = await getAllPostsQuery();
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
    const post = await updatePostQuery(data, fileContent);
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
    const deletedPost = await deletePostQuery(postId);
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
    const posts = await getPostsByUserIdQuery(userId);
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

  try {
    const { postId } = data;

    // Post Exists?
    const post = await dependencies.models.Post.findById(postId);
    if (!post) {
      response.statusCode = 404;
      throw new Error("Post not found.");
    }

    // User Exists?
    const user = await dependencies.models.User.findById(userId);
    if (!user) {
      response.statusCode = 404;
      throw new Error("User not found.");
    }

    const postObjectId = new mongoose.Types.ObjectId(postId);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Duplicate Save?
    if (user.savedPosts.includes(postObjectId)) {
      response.message = "Post is already saved.";
      return response;
    }


    user.savedPosts.push(postObjectId);
    await user.save();

    if (!post.savedBy.includes(userObjectId)) {
      post.savedBy.push(userObjectId);
      await post.save();
    }

    response.data = { savedPosts: user.savedPosts, savedBy: post.savedBy };
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
    const { postId } = data;

    // Post Exists?
    const post = await dependencies.models.Post.findById(postId);
    if (!post) {
      response.statusCode = 404;
      throw new Error("Post not found.");
    }

    // User Exists?
    const user = await dependencies.models.User.findById(userId);
    if (!user) {
      response.statusCode = 404;
      throw new Error("User not found.");
    }

    const postObjectId = new mongoose.Types.ObjectId(postId);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Duplicate Save?
    if (!user.savedPosts.includes(postObjectId)) {
      response.message = "Post is not saved.";
      return response;
    }

    user.savedPosts = user.savedPosts.filter(id => !id.equals(postObjectId));
    await user.save();

    post.savedBy = post.savedBy.filter(id => !id.equals(userObjectId));
    await post.save();

    response.data = { savedPosts: user.savedPosts, savedBy: post.savedBy };
  } catch (error) {
    response.status = false;
    response.message = (error as Error).message || "Unexpected error occurred";
    response.statusCode = response.statusCode || 500;
  }

  return response;
};


export const getAllSavedPosts = async (userId: string): Promise<ServiceResponse> => {
  let response: ServiceResponse = {
    message: "Got all saved posts successfully",
    status: true,
    statusCode: 200,
    data: null,
  };

  try {
    // User Exists?
    const user = await dependencies.models.User.findById(userId).populate({
      path: "savedPosts",
      select: "caption location postImage totalLikes postedBy likedBy savedBy comments createdAt updatedAt",
      populate: { path: "postedBy", select: "username profilePicture" }, 

    });

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

