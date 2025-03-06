import { NextFunction, Request, Response } from "express";
import { ServiceResponse } from "../../../util/interfaces";
import {
  addFeedbackSchema,
  updateFeedbackSchema,
  deleteFeedbackSchema,
  getFeedbackByIdSchema,
} from "../zod/zodSchema";

export const addFeedbackValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let response: ServiceResponse = {
    message: "success",
    status: true,
    statusCode: 200,
    data: null,
  };

  try {
    const data = req.body;
    const validation = addFeedbackSchema.safeParse(data);
    if (!validation.success) {
      response.statusCode = 400;
      response.data = validation.error.flatten().fieldErrors;
      throw new Error("Validation failed");
    }
    next();
  } catch (error) {
    response.status = false;
    response.message = (error as Error).message || "Unexpected error occurred";
    if (!response.statusCode || response.statusCode === 200) {
      response.statusCode = 500;
    }
    return res.status(response.statusCode).json({ msg: response.message, data: response.data });
  }
};

export const updateFeedbackValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let response: ServiceResponse = {
    message: "success",
    status: true,
    statusCode: 200,
    data: null,
  };

  try {
    const data = req.body;
    const validation = updateFeedbackSchema.safeParse(data);
    if (!validation.success) {
      response.statusCode = 400;
      response.data = validation.error.flatten().fieldErrors;
      throw new Error("Validation failed");
    }
    next();
  } catch (error) {
    response.status = false;
    response.message = (error as Error).message || "Unexpected error occurred";
    if (!response.statusCode || response.statusCode === 200) {
      response.statusCode = 500;
    }
    return res.status(response.statusCode).json({ msg: response.message, data: response.data });
  }
};

export const deleteFeedbackValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let response: ServiceResponse = {
    message: "success",
    status: true,
    statusCode: 200,
    data: null,
  };

  try {
    const { feedbackId } = req.params;
    const validation = deleteFeedbackSchema.safeParse({ feedbackId });
    if (!validation.success) {
      response.statusCode = 400;
      response.data = validation.error.flatten().fieldErrors;
      throw new Error("Validation failed");
    }
    next();
  } catch (error) {
    response.status = false;
    response.message = (error as Error).message || "Unexpected error occurred";
    if (!response.statusCode || response.statusCode === 200) {
      response.statusCode = 500;
    }
    return res.status(response.statusCode).json({ msg: response.message, data: response.data });
  }
};

export const getFeedbackByIdValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let response: ServiceResponse = {
    message: "success",
    status: true,
    statusCode: 200,
    data: null,
  };

  try {
    const { feedbackId } = req.params;
    const validation = getFeedbackByIdSchema.safeParse({ feedbackId });
    if (!validation.success) {
      response.statusCode = 400;
      response.data = validation.error.flatten().fieldErrors;
      throw new Error("Validation failed");
    }
    next();
  } catch (error) {
    response.status = false;
    response.message = (error as Error).message || "Unexpected error occurred";
    if (!response.statusCode || response.statusCode === 200) {
      response.statusCode = 500;
    }
    return res.status(response.statusCode).json({ msg: response.message, data: response.data });
  }
};