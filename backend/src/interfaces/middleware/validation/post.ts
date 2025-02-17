import { NextFunction, Request, Response } from "express";
import { IUpdatePostData, ServiceResponse } from "../../../util/interfaces";
import {
    addPostSchema,
    deletePostSchema,
    updatePostSchema,
} from "../zod/zodSchema";

export const addPostValidation = (
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

    const validation = addPostSchema.safeParse(data);
    if (!validation.success) {
      response.statusCode = 400;
      response.data = validation.error.flatten().fieldErrors;
      throw new Error("Validation failed");
    }

    if (!file) {
      response.statusCode = 400;
      throw new Error("Post Image is required.");
    }
    next();
  } catch (error) {
    response.status = false;
    response.message = (error as Error).message || "unexpected error occurred";
    if (!response.statusCode || response.statusCode === 200) {
      response.statusCode = 500;
    }

    return res
      .status(response.statusCode)
      .json({ msg: response.message, data: response.data });
  }
};

export const updatePostValidation = (
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
    const data: IUpdatePostData = req.body;
    const file = req.file;

    const validation = updatePostSchema.safeParse(data);
    if (!validation.success) {
      response.statusCode = 400;
      response.data = validation.error.flatten().fieldErrors;
      throw new Error("Validation failed");
    }

    if (!file && data.isImageUpdated) {
      response.statusCode = 400;
      throw new Error("Post Image is required.");
    }
    next();
  } catch (error) {
    response.status = false;
    response.message = (error as Error).message || "unexpected error occurred";
    if (!response.statusCode || response.statusCode === 200) {
      response.statusCode = 500;
    }

    return res
      .status(response.statusCode)
      .json({ msg: response.message, data: response.data });
  }
};

export const deletePostValidation = (
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
    const data = req.params;

    const validation = deletePostSchema.safeParse(data);
    if (!validation.success) {
      response.statusCode = 400;
      response.data = validation.error.flatten().fieldErrors;
      throw new Error("Validation failed");
    }
    next();
  } catch (error) {
    response.status = false;
    response.message = (error as Error).message || "unexpected error occurred";
    if (!response.statusCode || response.statusCode === 200) {
      response.statusCode = 500;
    }
    return res
      .status(response.statusCode)
      .json({ msg: response.message, data: response.data });
  }
};


export const getPostByIdValidation = (
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
      const data = req.params;
  
      const validation = deletePostSchema.safeParse(data);
      if (!validation.success) {
        response.statusCode = 400;
        response.data = validation.error.flatten().fieldErrors;
        throw new Error("Validation failed");
      }
      next();
    } catch (error) {
      response.status = false;
      response.message = (error as Error).message || "unexpected error occurred";
      if (!response.statusCode || response.statusCode === 200) {
        response.statusCode = 500;
      }
      return res
        .status(response.statusCode)
        .json({ msg: response.message, data: response.data });
    }
  };