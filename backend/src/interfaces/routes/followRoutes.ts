import { Request, Response, Router } from "express";
import {
  followersList,
  followingList,
  updateFollow,
} from "../../infrastructure/repositories/followRepository";
import { serverError } from "../../util/helper";
import { updateFollowValidation } from "../middleware/validation/follow";

const followRoutes = Router();

followRoutes.get(
  "/update-follow/:friendId",
  updateFollowValidation,
  async (req: Request, res: Response) => {
    try {
      const { userId } = res.locals.jwtData;
      const { friendId } = req.params;
      const response = await updateFollow(userId, friendId);
      res
        .status(response.statusCode)
        .json({ msg: response.message, data: response.data });
    } catch (error) {
      serverError(res, error);
    }
  }
);

followRoutes.get("/get-followers-list", async (req: Request, res: Response) => {
  try {
    const { userId } = res.locals.jwtData;
    const response = await followersList(userId);
    res
      .status(response.statusCode)
      .json({ msg: response.message, data: response.data });
  } catch (error) {
    serverError(res, error);
  }
});

followRoutes.get("/get-following-list", async (req: Request, res: Response) => {
  try {
    const { userId } = res.locals.jwtData;
    const response = await followingList(userId);
    res
      .status(response.statusCode)
      .json({ msg: response.message, data: response.data });
  } catch (error) {
    serverError(res, error);
  }
});

export default followRoutes;