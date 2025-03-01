import { Request, Response, Router } from "express";
import { findUsers } from "../../infrastructure/repositories/userRepository";
import { serverError } from "../../util/helper";
import { verifyToken } from "../../util/token";

const searchRoutes = Router();
searchRoutes.use(verifyToken);

searchRoutes.post("/search-user", async (req: Request, res: Response) => {
  try {
    const {userName} = req.body;;
    if (!userName) {
      return res.status(400).json({ msg: "user rquired" });
    }

    const users = await findUsers(userName);

    return res.status(200).json({
      msg: "Users found",
      data: users,
    });
  } catch (error) {
    return serverError(res, error);
  }
});

export default searchRoutes;



