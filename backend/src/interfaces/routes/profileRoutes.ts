import { Request, Response, Router } from "express";
import { serverError } from "../../util/helper";
import { IUpdateProfileData, ServiceResponse } from "../../util/interfaces";
import { verifyToken } from "../../util/token";
import getDataUri from "../middleware/cloud/dataUri";
import singleUpload from "../middleware/cloud/multer";
import { createDefaultProfile, deleteProfile, getProfile, updateProfile } from "../../infrastructure/repositories/profileRepository";
import { createProfileValidation, updateProfileValidation } from "../middleware/validation/profile";

const profileRoutes = Router();

profileRoutes.use(verifyToken);

profileRoutes.post(
  "/create-profile",
  createProfileValidation,
  async (req: Request, res: Response) => {
    try {
      const { userId }: { userId: string } = res.locals.jwtData;
      const { userName } = req.body;

      const response: ServiceResponse = await createDefaultProfile(userId, userName);

      res.status(response.statusCode).json({
        msg: response.message,
        data: response.data,
      });
    } catch (error) {
      return serverError(res, error);
    }
  }
);

profileRoutes.get(
  "/get-profile/:userId?",
  async (req: Request, res: Response) => {
    try {
      const requestedUserId = req.params.userId || res.locals.jwtData.userId;

      if (!requestedUserId) {
        return res.status(400).json({
          msg: "User ID is required",
          status: false,
          statusCode: 400,
          data: null
        });
      }

      const response: ServiceResponse = await getProfile(requestedUserId);

      res.status(response.statusCode).json({
        msg: response.message,
        data: response.data,
      });
    } catch (error) {
      return serverError(res, error);
    }
  }
);

profileRoutes.put(
  "/update-profile",
  updateProfileValidation,
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

profileRoutes.delete(
  "/delete-profile",
  async (req: Request, res: Response) => {
    try {
      const { userId }: { userId: string } = res.locals.jwtData;

      const response: ServiceResponse = await deleteProfile(userId);

      res.status(response.statusCode).json({
        msg: response.message,
        data: response.data,
      });
    } catch (error) {
      return serverError(res, error);
    }
  }
);

export default profileRoutes;




//Implement search for users by their unique username. This is to allow 
// users to find each other. just the back end is what I need. and follow 
// formating we used for saving, and liking, with