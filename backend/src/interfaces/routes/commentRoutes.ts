import { Request, Response, Router } from "express";
import { addComment } from "../../infrastructure/respositories/commentRepository";
import { serverError } from "../../util/helper";
import { ICreateComment } from "../../util/interfaces";

const commentRoutes = Router();

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

export default commentRoutes;