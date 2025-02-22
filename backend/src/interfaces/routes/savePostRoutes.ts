import express, { Request, Router } from "express";
import { savePost, unsavePost, getAllSavedPosts } from "../../infrastructure/respositories/postRepository";
import { ISavePostData, ServiceResponse } from "../../util/interfaces";
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

    const response = await savePost(userId, { postId });

    return res.status(response.statusCode).json(response);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
});


savePostRoutes.post("/unsave-Post", async (req, res) => {
  try {
    const { userId }: { userId: string } = res.locals.jwtData;
    const { postId }: ISavePostData = req.body;

    if (!postId) {
      return res.status(400).json({ message: "Post is required." });
    }

    const response = await unsavePost(userId, { postId });

    return res.status(response.statusCode).json(response);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
});


savePostRoutes.get("/getAllSaved", async (req, res) => {
  try {
    const { userId }: { userId: string } = res.locals.jwtData;

    const response = await getAllSavedPosts(userId);

    return res.status(response.statusCode).json(response);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
});


// postRoutes.get("/get-allPosts", async (req: Request, res: Response) => {
//   try {
//     const response: ServiceResponse = await getAllPosts();
//     res
//       .status(response.statusCode)
//       .json({ msg: response.message, data: response.data });
//   } catch (error) {
//     return serverError(res, error);
//   }
// });

export default savePostRoutes;
