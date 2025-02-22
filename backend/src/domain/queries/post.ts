import dependencies from "../../infrastructure/dependencies";
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