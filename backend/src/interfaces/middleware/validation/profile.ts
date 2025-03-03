import { NextFunction, Request, Response } from "express";
import { ServiceResponse } from "../../../util/interfaces";
import {
  createProfileSchema,
  updateProfileSchema,
  deleteProfileSchema,
  getProfileByIdSchema,
} from "../zod/zodSchema";

export const createProfileValidation = (
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
    const file = req.file;

    const validation = createProfileSchema.safeParse(data);
    if (!validation.success) {
      response.statusCode = 400;
      response.data = validation.error.flatten().fieldErrors;
      throw new Error("Validation failed");
    }

    if (!file) {
      response.statusCode = 400;
      throw new Error("Profile picture is required.");
    }

    next();
  } catch (error) {
    response.status = false;
    response.message = (error as Error).message || "Unexpected error occurred";
    if (!response.statusCode || response.statusCode === 200) {
      response.statusCode = 500;
    }

    return res
      .status(response.statusCode)
      .json({ msg: response.message, data: response.data });
  }
};

export const updateProfileValidation = (
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
    const file = req.file;

    const validation = updateProfileSchema.safeParse(data);
    if (!validation.success) {
      response.statusCode = 400;
      response.data = validation.error.flatten().fieldErrors;
      throw new Error("Validation failed");
    }

    if (!file && data.isImageUpdated) {
      response.statusCode = 400;
      throw new Error("Profile picture is required.");
    }

    next();
  } catch (error) {
    response.status = false;
    response.message = (error as Error).message || "Unexpected error occurred";
    if (!response.statusCode || response.statusCode === 200) {
      response.statusCode = 500;
    }

    return res
      .status(response.statusCode)
      .json({ msg: response.message, data: response.data });
  }
};

export const deleteProfileValidation = (
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
    const { userId } = req.params;

    const validation = deleteProfileSchema.safeParse({ userId });
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

    return res
      .status(response.statusCode)
      .json({ msg: response.message, data: response.data });
  }
};

export const getProfileByIdValidation = (
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
    const { userId } = req.params;

    const validation = getProfileByIdSchema.safeParse({ userId });
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

    return res
      .status(response.statusCode)
      .json({ msg: response.message, data: response.data });
  }
  
};