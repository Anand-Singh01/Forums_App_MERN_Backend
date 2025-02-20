import express, { Request, Router } from "express";
import { savePost } from "../../infrastructure/respositories/postRepository";
import { ISavePostData } from "../../util/interfaces";
import { verifyToken } from "../../util/token";

const savePostRoutes = Router();
savePostRoutes.use(verifyToken);

savePostRoutes.post("/save-Post", async (req, res) => {
  try {
    const { userId }: { userId: string } = res.locals.jwtData;
    const { postId }: ISavePostData = req.body;

    if (!postId) {
      return res.status(400).json({ message: "Post ID is required." });
    }

    // Call the service function
    const response = await savePost(userId, { postId });

    return res.status(response.statusCode).json(response);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
});

export default savePostRoutes;
