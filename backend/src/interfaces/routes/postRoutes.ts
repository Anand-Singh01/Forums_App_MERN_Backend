import { Request, Response, Router } from "express";
import { addPost } from "../../infrastructure/respositories/postRepository";
import { serverError } from "../../util/helper";
import { IPostData, ServiceResponse } from "../../util/interfaces";
import getDataUri from "../middleware/cloud/dataUri";
import singleUpload from "../middleware/cloud/multer";

const postRoutes = Router();

// postRoutes.use(verifyToken);

postRoutes.post("/add-post", singleUpload, async(req: Request, res: Response) => {
  try {
    const { userId } : {userId:string} = res.locals.jwtData;
    const data : IPostData = req.body;
    const file: Express.Multer.File | undefined = req.file;
    let fileContent : string | undefined;
    if(file){
        fileContent = getDataUri(file).content;
    }
    const response : ServiceResponse = await addPost(userId, data, fileContent);
    res
    .status(response.statusCode)
    .json({ msg: response.message, data: response.data });
  } catch (error) {
    return serverError(res, error);
  }
});

export default postRoutes;
