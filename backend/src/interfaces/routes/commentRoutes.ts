import { Request, Response, Router } from "express";
import {
  addComment,
  addReply,
  getCommentAndReply,
} from "../../infrastructure/respositories/commentRepository";
import { serverError } from "../../util/helper";
import { ICreateComment, ICreateReply } from "../../util/interfaces";

const commentRoutes = Router();

// Adds a comment under a post
commentRoutes.post("/add-comment", async (req: Request, res: Response) => {
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
});

// Adds a reply under a comment
commentRoutes.post("/add-reply", async (req: Request, res: Response) => {
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
});

//  Sends all comments and their reply's
commentRoutes.get(
  "/get-comment-and-reply/:postId",
  async (req: Request, res: Response) => {
    try {
      const { postId } = req.params;
      const response = await getCommentAndReply(postId);
      res
        .status(response.statusCode)
        .json({ msg: response.message, data: response.data });
    } catch (error) {
      return serverError(res, error);
    }
  }
);

export default commentRoutes;