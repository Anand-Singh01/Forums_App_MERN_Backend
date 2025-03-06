import { NextFunction, Request, Response } from "express";
import { ServiceResponse } from "../../../util/interfaces";
import {
  addCommentSchema,
  addReplySchema,
  deleteCommentSchema,
  deleteReplySchema,
  getAllCommentsSchema,
  getAllReplySchema,
  updateCommentSchema,
  updateReplySchema,
} from "../zod/zodSchema";

export const addCommentValidation = (
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
    const validation = addCommentSchema.safeParse(data);
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

export const getAllCommentValidation = (
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
    const { postId } = req.params;
    const validation = getAllCommentsSchema.safeParse({ postId });
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

export const updateCommentValidation = (
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
    const validation = updateCommentSchema.safeParse(data);
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

export const deleteCommentValidation = (
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
    const { commentId } = req.params;
    const validation = deleteCommentSchema.safeParse({ commentId });
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

export const addReplyValidation = (
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
    const validation = addReplySchema.safeParse(data);
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

export const getAllReplyValidation = (
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
    const { commentId } = req.params;
    const validation = getAllReplySchema.safeParse({ commentId });
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

export const updateReplyValidation = (
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
    const validation = updateReplySchema.safeParse(data);
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

export const deleteReplyValidation = (
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
    const { replyId } = req.params;
    const validation = deleteReplySchema.safeParse({ replyId });
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

