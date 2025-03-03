import express, { Request, Response } from "express";
import { serverError } from "../../util/helper";
import { verifyToken } from "../../util/token";
import {
    addFeedbackValidation,
    updateFeedbackValidation,
    deleteFeedbackValidation,
    getFeedbackByIdValidation,
  } from "../middleware/validation/feedback";
  import {
    addFeedback,
    updateFeedback,
    deleteFeedback,
    getFeedbackById,
    getAllFeedbackByUserId,
  } from "../../infrastructure/repositories/feedbackRepository"; 

const feedbackRoutes = express.Router();

feedbackRoutes.use(verifyToken);

// Add Feedback
feedbackRoutes.post(
  "/",
  addFeedbackValidation,
  async (req: Request, res: Response) => {
    try {
      const { userId }: { userId: string } = res.locals.jwtData; 
      const { header, description } = req.body;

      const response = await addFeedback(header, description, userId);

      res.status(response.statusCode).json({
        msg: response.message,
        data: response.data,
      });
    } catch (error) {
      return serverError(res, error);
    }
  }
);

// Update Feedback
feedbackRoutes.put(
  "/:feedbackId",
  updateFeedbackValidation,
  async (req: Request, res: Response) => {
    try {
      const { feedbackId } = req.params;
      const { header, description } = req.body;

      const response = await updateFeedback(feedbackId, header, description);

      res.status(response.statusCode).json({
        msg: response.message,
        data: response.data,
      });
    } catch (error) {
      return serverError(res, error);
    }
  }
);

// Delete Feedback
feedbackRoutes.delete(
  "/:feedbackId",
  deleteFeedbackValidation,
  async (req: Request, res: Response) => {
    try {
      const { feedbackId } = req.params;

      const response = await deleteFeedback(feedbackId);

      res.status(response.statusCode).json({
        msg: response.message,
        data: response.data,
      });
    } catch (error) {
      return serverError(res, error);
    }
  }
);

// Get Feedback by ID
feedbackRoutes.get(
  "/:feedbackId",
  getFeedbackByIdValidation,
  async (req: Request, res: Response) => {
    try {
      const { feedbackId } = req.params;

      const response = await getFeedbackById(feedbackId);

      res.status(response.statusCode).json({
        msg: response.message,
        data: response.data,
      });
    } catch (error) {
      return serverError(res, error);
    }
  }
);

// Get All Feedback by User ID
feedbackRoutes.get(
  "/user/:userId",
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      const response = await getAllFeedbackByUserId(userId);

      res.status(response.statusCode).json({
        msg: response.message,
        data: response.data,
      });
    } catch (error) {
      return serverError(res, error);
    }
  }
);

export default feedbackRoutes;