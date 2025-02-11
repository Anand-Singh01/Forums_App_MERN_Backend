import { Request, Response, Router } from "express";
import { addComment, addReply } from "../../infrastructure/respositories/commentRepository";
import { serverError } from "../../util/helper";
import { ICreateComment, ICreateReply } from "../../util/interfaces";

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

export default commentRoutes;