import { Comment } from "../../domain/models/comment";
import { Post } from "../../domain/models/post";
import { ICreateComment, ServiceResponse } from "../../util/interfaces";

export const addComment = async (
  userId: string,
  data: ICreateComment
) => {
  let response: ServiceResponse = {
    message: "success",
    status: true,
    statusCode: 200,
    data: null,
  };

  try {
    const {comment, postId} = data;
    const post = await Post.findById(postId);
    if(!post){
        response.statusCode = 404;
        throw new Error("Post not found.");
    }

    const newComment = new Comment({
        comment,
        commentedBy:userId,
        commentedPost:post._id
    });
    await newComment.save();
    
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