import { Request, Response, Router } from "express";
import {
  addComment,
  addReply,
  deleteComment,
  deleteReply,
  getAllComments,
  getAllReply,
  updateComment,
  updateReply,
} from "../../infrastructure/repositories/commentRepository";
import { serverError } from "../../util/helper";
import {
  ICreateComment,
  ICreateReply,
  IUpdateComment,
  IUpdateReply,
} from "../../util/interfaces";
import {
  addCommentValidation,
  addReplyValidation,
  deleteCommentValidation,
  deleteReplyValidation,
  getAllCommentValidation,
  getAllReplyValidation,
  updateCommentValidation,
  updateReplyValidation,
} from "../middleware/validation/comment";

const commentRoutes = Router();

// Adds a comment under a post
commentRoutes.post(
  "/add-comment",
  addCommentValidation,
  async (req: Request, res: Response) => {
    try {
      const { userId } = res.locals.jwtData;
      const data: ICreateComment = req.body;
      const response = await addComment(userId, data);
      res
        .status(response.statusCode)
        .json({ msg: response.message, data: response.data });
    } catch (error) {
      return serverError(res, error);
    }
  }
);

// get all comments
commentRoutes.get(
  "/get-all-comments/:postId",
  getAllCommentValidation,
  async (req: Request, res: Response) => {
    try {
      const { postId } = req.params;
      const response = await getAllComments(postId);
      res
        .status(response.statusCode)
        .json({ msg: response.message, data: response.data });
    } catch (error) {
      return serverError(res, error);
    }
  }
);

// Update a comment
commentRoutes.put(
  "/update-comment",
  updateCommentValidation,
  async (req: Request, res: Response) => {
    try {
      const { userId } = res.locals.jwtData;
      const data: IUpdateComment = req.body;
      const response = await updateComment(userId, data);
      res
        .status(response.statusCode)
        .json({ msg: response.message, data: response.data });
    } catch (error) {
      return serverError(res, error);
    }
  }
);

// Delete a comment
commentRoutes.delete(
  "/delete-comment/:commentId",
  deleteCommentValidation,
  async (req: Request, res: Response) => {
    try {
      const { userId } = res.locals.jwtData;
      const { commentId } = req.params;
      const response = await deleteComment(userId, commentId);
      res
        .status(response.statusCode)
        .json({ msg: response.message, data: response.data });
    } catch (error) {
      return serverError(res, error);
    }
  }
);

// Adds a reply under a comment
commentRoutes.post(
  "/add-reply",
  addReplyValidation,
  async (req: Request, res: Response) => {
    try {
      const { userId } = res.locals.jwtData;
      const data: ICreateReply = req.body;
      const response = await addReply(userId, data);
      res
        .status(response.statusCode)
        .json({ msg: response.message, data: response.data });
    } catch (error) {
      return serverError(res, error);
    }
  }
);

// get all reply
commentRoutes.get(
  "/get-all-reply/:commentId",
  getAllReplyValidation,
  async (req: Request, res: Response) => {
    try {
      const { commentId } = req.params;
      const response = await getAllReply(commentId);
      res
        .status(response.statusCode)
        .json({ msg: response.message, data: response.data });
    } catch (error) {
      return serverError(res, error);
    }
  }
);

// Update a reply
commentRoutes.put(
  "/update-reply",
  updateReplyValidation,
  async (req: Request, res: Response) => {
    try {
      const { userId } = res.locals.jwtData;
      const data: IUpdateReply = req.body;
      const response = await updateReply(userId, data);
      res
        .status(response.statusCode)
        .json({ msg: response.message, data: response.data });
    } catch (error) {
      return serverError(res, error);
    }
  }
);

// Delete a reply
commentRoutes.delete(
  "/delete-reply/:replyId",
  deleteReplyValidation,
  async (req: Request, res: Response) => {
    try {
      const { userId } = res.locals.jwtData;
      const { replyId } = req.params;
      const response = await deleteReply(userId, replyId);
      res
        .status(response.statusCode)
        .json({ msg: response.message, data: response.data });
    } catch (error) {
      return serverError(res, error);
    }
  }
);

export default commentRoutes;
