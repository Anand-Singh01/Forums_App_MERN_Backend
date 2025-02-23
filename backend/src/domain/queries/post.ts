import dependencies from "../../infrastructure/dependencies";
import { IUpdatePostData } from "../../util/interfaces";

// Saves image on cloud and returns the url.
export const saveImageOnCloud = async (fileContent: string) => {
  const myCloud = await dependencies.cloud.v2.uploader.upload(fileContent);
  return myCloud.secure_url;
};

// Adds a post to db and returns the saved post
export const addPostQuery = async (
  caption: string,
  region: string | null,
  postImage: string,
  userId: string
) => {
  const post = new dependencies.models.Post({
    caption,
    region,
    postImage,
    postedBy: userId,
  });
  await post.save();
  return await post.populate({
    path: "postedBy",
    select: "profile userName",
    populate: {
      path: "profile",
      select: "profilePicture",
    },
  });
};

// returns the post based on it's Id
export const getPostByIdQuery = async (postId: string) => {
  return await dependencies.models.Post.findById(postId).populate({
    path: "postedBy",
    select: "profile userName",
    populate: {
      path: "profile",
      select: "profilePicture",
    },
  });
};

// returns all posts from db
export const getAllPostsQuery = async () => {
  return await dependencies.models.Post.find()
    .populate({
      path: "postedBy",
      select: "profile userName",
      populate: {
        path: "profile",
        select: "profilePicture",
      },
    })
    .sort({ likedBy: -1, updatedAt: -1 });
};

// updates a post and returns the updated post.
export const updatePostQuery = async (
  data: IUpdatePostData,
  fileContent: string | undefined
) => {
  const post = await dependencies.models.Post.findById(data.postId);
  if (!post) {
    throw new Error("post not found.");
  }
  post.region = data.region;
  post.caption = data.caption;
  if (data.isImageUpdated && fileContent) {
    const imageUrl = await saveImageOnCloud(fileContent);
    if (!imageUrl) {
      throw new Error("error saving the image.");
    }
    post.postImage = imageUrl;
  } else if (
    data.isImageUpdated.toLocaleLowerCase() === "true" &&
    !fileContent
  ) {
    throw new Error("image is required to update.");
  }
  await post.save();
  return await post.populate({
    path: "postedBy",
    select: "profile userName",
    populate: {
      path: "profile",
      select: "profilePicture",
    },
  });
};

// deletes a post based on it's Id and returns it.
export const deletePostQuery = async (postId: string) => {
  return await dependencies.models.Post.findByIdAndDelete(postId);
};

// returns all the posts based on userId.
export const getPostsByUserIdQuery = async (userId: string) => {
  return await dependencies.models.Post.find({ postedBy: userId })
    .populate({
      path: "postedBy",
      select: "profile userName",
      populate: {
        path: "profile",
        select: "profilePicture",
      },
    })
    .sort({ createdAt: -1 });
};
