import { Request, Response, Router } from "express";
import {
  addPost,
  deletePost,
  getAllPosts,
  getMyPosts,
  getPostById,
  updatePost,
} from "../../infrastructure/respositories/postRepository";
import { serverError } from "../../util/helper";
import {
  IAddPostData,
  IUpdatePostData,
  ServiceResponse,
} from "../../util/interfaces";
import { verifyToken } from "../../util/token";
import getDataUri from "../middleware/cloud/dataUri";
import singleUpload from "../middleware/cloud/multer";
import {
  addPostValidation,
  deletePostValidation,
  getPostByIdValidation,
  updatePostValidation,
} from "../middleware/validation/post";

const postRoutes = Router();

postRoutes.use(verifyToken);

// Add a post
postRoutes.post(
  "/add-post",
  singleUpload,
  addPostValidation,
  async (req: Request, res: Response) => {
    try {
      const { userId }: { userId: string } = res.locals.jwtData;
      const data: IAddPostData = req.body;
      const file: Express.Multer.File | undefined = req.file;
      let fileContent: string | undefined;
      if (file) {
        fileContent = getDataUri(file).content;
      }
      const response: ServiceResponse = await addPost(
        userId,
        data,
        fileContent
      );
      res
        .status(response.statusCode)
        .json({ msg: response.message, data: response.data });
    } catch (error) {
      return serverError(res, error);
    }
  }
);

// Get post by Id
postRoutes.get(
  "/get-post/:postId",
  getPostByIdValidation,
  async (req: Request, res: Response) => {
    try {
      const { postId } = req.params;
      const response: ServiceResponse = await getPostById(postId);
      res
        .status(response.statusCode)
        .json({ msg: response.message, data: response.data });
    } catch (error) {
      return serverError(res, error);
    }
  }
);

// Get all posts
postRoutes.get("/get-trending-post", async (req: Request, res: Response) => {
  try {
    const response: ServiceResponse = await getAllPosts();
    res
      .status(response.statusCode)
      .json({ msg: response.message, data: response.data });
  } catch (error) {
    return serverError(res, error);
  }
});

// Update post
postRoutes.put(
  "/update-post",
  singleUpload,
  updatePostValidation,
  async (req: Request, res: Response) => {
    try {
      const data: IUpdatePostData = req.body;
      const file: Express.Multer.File | undefined = req.file;
      let fileContent: string | undefined = undefined;
      if (data.isImageUpdated.toLocaleLowerCase() === "true" && file) {
        fileContent = getDataUri(file).content;
      }
      const response: ServiceResponse = await updatePost(data, fileContent);
      res
        .status(response.statusCode)
        .json({ msg: response.message, data: response.data });
    } catch (error) {
      return serverError(res, error);
    }
  }
);

// Delete post
postRoutes.delete(
  "/delete-post/:postId",
  deletePostValidation,
  async (req: Request, res: Response) => {
    try {
      const { postId } = req.params;
      const response: ServiceResponse = await deletePost(postId);
      res
        .status(response.statusCode)
        .json({ msg: response.message, data: response.data });
    } catch (error) {
      return serverError(res, error);
    }
  }
);

// Get my posts
postRoutes.get("/get-my-posts", async (req: Request, res: Response) => {
  try {
    const { userId }: { userId: string } = res.locals.jwtData;
    const response: ServiceResponse = await getMyPosts(userId);
    res
      .status(response.statusCode)
      .json({ msg: response.message, data: response.data });
  } catch (error) {
    return serverError(res, error);
  }
});

export default postRoutes;
