import { Request, Response, Router } from "express";
import { updateProfile } from "../../infrastructure/respositories/preferenceRepository";
import { serverError } from "../../util/helper";
import { IUpdateProfileData, ServiceResponse } from "../../util/interfaces";
import { verifyToken } from "../../util/token";
import getDataUri from "../middleware/cloud/dataUri";
import singleUpload from "../middleware/cloud/multer";

const preferenceRoutes = Router()

preferenceRoutes.put(
  "/update-profile",
  singleUpload, 
  async (req: Request, res: Response) => {
    try {
      const { userId }: { userId: string } = res.locals.jwtData; 
      const { name, description, isImageUpdated }: IUpdateProfileData = req.body; 
      const file: Express.Multer.File | undefined = req.file; 

      let fileContent: string | undefined;
      if (isImageUpdated && file) {
        fileContent = getDataUri(file).content;
      }

      const response: ServiceResponse = await updateProfile(userId, {
        name,
        description,
        isImageUpdated,
      }, fileContent);

      res.status(response.statusCode).json({
        msg: response.message,
        data: response.data,
      });
    } catch (error) {
      return serverError(res, error);
    }
  }
);

export default preferenceRoutes;