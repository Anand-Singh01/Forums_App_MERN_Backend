import { Response } from "express";

export const serverError = (res: Response, error: any) => {
  console.log(error);
  return res.status(500).json({ msg: "server error" });
};

export const unauthorizedError = (res: Response, msg: string) => {
  return res.status(401).json({ msg });
};

export const success = (res: Response, payload: {}) => {
  return res.status(200).json(payload);
};

export const badRequest = (res: Response, msg: string) => {
  return res.status(409).json({ msg });
};