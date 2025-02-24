import { Router } from "express";
import { getAllLikedPosts, likePost, unlikePost } from "../../infrastructure/repositories/likePostRepository";
import { ILikePostData } from "../../util/interfaces";
import { verifyToken } from "../../util/token";

const likePostRoutes = Router();
likePostRoutes.use(verifyToken);

likePostRoutes.post("/like-Post", async (req, res) => {
  try {
    const { userId }: { userId: string } = res.locals.jwtData;
    const { postId }: ILikePostData = req.body;

    if (!postId) {
      return res.status(400).json({ message: "Post ID is required." });
    }

    const response = await likePost(userId, { postId });

    return res.status(response.statusCode).json(response);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
});

likePostRoutes.post("/unlike-Post", async (req, res) => {
  try {
    const { userId }: { userId: string } = res.locals.jwtData;
    const { postId }: ILikePostData = req.body;

    if (!postId) {
      return res.status(400).json({ message: "Post is required." });
    }

    const response = await unlikePost(userId, { postId });

    return res.status(response.statusCode).json(response);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
});

likePostRoutes.get("/getAllLiked", async (req, res) => {
  try {
    const { userId }: { userId: string } = res.locals.jwtData;

    const response = await getAllLikedPosts(userId);

    return res.status(response.statusCode).json(response);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
});

export default likePostRoutes;
