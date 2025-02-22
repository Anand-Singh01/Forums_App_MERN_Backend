import dependencies from "../../infrastructure/dependencies";
import mongoose from "mongoose";
import { IUpdatePostData } from "../../util/interfaces";

export const saveImageOnCloud = async (fileContent: string) => {
  const myCloud = await dependencies.cloud.v2.uploader.upload(fileContent);
  return myCloud.secure_url;
};

export const addPostQuery = async (
  caption: string,
  location: string | null,
  postImage: string,
  userId: string
) => {
  const post = new dependencies.models.Post({
    caption,
    location,
    postImage,
    postedBy: userId,
  });
  return await post.save();
};

export const getPostByPostIdQuery = async (postId: string) => {
  return await dependencies.models.Post.findById(postId);
};

export const getAllPostsQuery = async () => {
  return await dependencies.models.Post.find();
};

export const updatePostQuery = async (
  data: IUpdatePostData,
  fileContent: string | undefined
) => {
  const post = await dependencies.models.Post.findById(data.postId);
  if (!post) {
    throw new Error("post not found to update.");
  }
  post.location = data.location;
  post.caption = data.caption;
  if (data.isImageUpdated && fileContent) {
    const imageUrl = await saveImageOnCloud(fileContent);
    if (!imageUrl) {
      throw new Error("error saving the image.");
    }
    post.postImage = imageUrl;
  } else if (data.isImageUpdated && !fileContent) {
    throw new Error("image is required to update.");
  }
  await post.save();
  return post;
};

export const deletePostQuery = async (postId: string) => {
  return await dependencies.models.Post.findByIdAndDelete(postId);
};

export const getPostsByUserIdQuery = async (userId: string) => {
  return await dependencies.models.Post.find({ postedBy: userId });
};


export const savePostQuery = async (userId: string, postId: string) => {
  const post = await dependencies.models.Post.findById(postId);
  if (!post) throw new Error("Post not found.");

  const user = await dependencies.models.User.findById(userId);
  if (!user) throw new Error("User not found.");

  const postObjectId = new mongoose.Types.ObjectId(postId);
  const userObjectId = new mongoose.Types.ObjectId(userId);

  if (user.savedPosts.includes(postObjectId)) {
    throw new Error("Post is already saved.");
  }

  user.savedPosts.push(postObjectId);
  await user.save();

  if (!post.savedBy.includes(userObjectId)) {
    post.savedBy.push(userObjectId);
    await post.save();
  }

  return { savedPosts: user.savedPosts, savedBy: post.savedBy };
};

export const unsavePostQuery = async (userId: string, postId: string) => {
  const post = await dependencies.models.Post.findById(postId);
  if (!post) throw new Error("Post not found.");

  const user = await dependencies.models.User.findById(userId);
  if (!user) throw new Error("User not found.");

  const postObjectId = new mongoose.Types.ObjectId(postId);
  const userObjectId = new mongoose.Types.ObjectId(userId);

  if (!user.savedPosts.includes(postObjectId)) {
    throw new Error("Post is not saved.");
  }

  user.savedPosts = user.savedPosts.filter(id => !id.equals(postObjectId));
  await user.save();

  post.savedBy = post.savedBy.filter(id => !id.equals(userObjectId));
  await post.save();

  return { savedPosts: user.savedPosts, savedBy: post.savedBy };
};


export const getAllSavedPostsQuery = async (userId: string) => {
  return await dependencies.models.User.findById(userId).populate({

    path: "savedPosts",
    select: "caption location postImage totalLikes postedBy likedBy savedBy comments createdAt updatedAt",
    populate: { path: "postedBy", select: "username profilePicture" },

  });
};



export const likePostQuery = async (userId: string, postId: string) => {
  const post = await dependencies.models.Post.findById(postId);
  if (!post) throw new Error("Post not found.");

  const user = await dependencies.models.User.findById(userId);
  if (!user) throw new Error("User not found.");

  const postObjectId = new mongoose.Types.ObjectId(postId);
  const userObjectId = new mongoose.Types.ObjectId(userId);

  if (user.likedPosts.includes(postObjectId)) {
    throw new Error("Post is already liked.");
  }

  user.likedPosts.push(postObjectId);
  await user.save();

  if (!post.likedBy.includes(userObjectId)) {
    post.likedBy.push(userObjectId);
    await post.save();
  }

  return { likedPosts: user.likedPosts, likedBy: post.likedBy };
};



export const unlikePostQuery = async (userId: string, postId: string) => {
  const post = await dependencies.models.Post.findById(postId);
  if (!post) throw new Error("Post not found.");

  const user = await dependencies.models.User.findById(userId);
  if (!user) throw new Error("User not found.");

  const postObjectId = new mongoose.Types.ObjectId(postId);
  const userObjectId = new mongoose.Types.ObjectId(userId);

  if (!user.likedPosts.includes(postObjectId)) {
    throw new Error("Post is not liked.");
  }

  user.likedPosts = user.likedPosts.filter(id => !id.equals(postObjectId));
  await user.save();

  post.likedBy = post.likedBy.filter(id => !id.equals(userObjectId));
  await post.save();

  return { likedPosts: user.likedPosts, likedBy: post.likedBy };
};


export const getAllLikedPostsQuery = async (userId: string) => {
  return await dependencies.models.User.findById(userId).populate({
    path: "likedPosts",
    select: "caption location postImage totalLikes postedBy likedBy savedBy comments createdAt updatedAt",
    populate: { path: "postedBy", select: "username profilePicture" },
  });
};