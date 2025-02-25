import { NextFunction, Request, Response } from "express";
import { IMessageRequest, ServiceResponse } from "../../../util/interfaces";
import { addMessageSchema, getAllMessageSchema } from "../zod/zodSchema";

export const addMessageValidation = (message: IMessageRequest) => {
  let response: ServiceResponse = {
    message: "success",
    status: true,
    statusCode: 200,
    data: null,
  };

  try {
    const validation = addMessageSchema.safeParse(message);
    if (!validation.success) {
        response.statusCode = 400;
        response.data = validation.error.flatten().fieldErrors;
        throw new Error("Validation failed");
      }
  } catch (error) {
    response.status = false;
    response.message = (error as Error).message || "unexpected error occurred";
  }
  return response;
};

export const getAllMessagesValidation = (
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
    const { receiverId } = req.params;
    const validation = getAllMessageSchema.safeParse({ receiverId });
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
