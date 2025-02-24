import { NextFunction, Request, Response } from "express";
import { ServiceResponse } from "../../../util/interfaces";
import { updateFollowSchema } from "../zod/zodSchema";

export const updateFollowValidation = (
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
    const { friendId } = req.params;
    const validation = updateFollowSchema.safeParse({ friendId });
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
