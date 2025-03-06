import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dependencies from "../../infrastructure/dependencies";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../../infrastructure/repositories/userRepository";
import { serverError } from "../../util/helper";
import { ILoginUser, IRegisterUser } from "../../util/interfaces";
import { verifyToken } from "../../util/token";

const authRoutes = express.Router();

authRoutes.post("/register", async (req: Request, res: Response) => {
  try {
    const response = await registerUser(req.body, res);
    res.status(response.statusCode).json({ message: response.message, data: response.data });
  } catch (error) {
    serverError(res, error);
  }
});

authRoutes.post("/login", async (req: Request, res: Response) => {
  try {
    const response = await loginUser(req.body, res);
    res.status(response.statusCode).json({ message: response.message, data: response.data });
  } catch (error) {
    serverError(res, error);
  }
});

authRoutes.get("/verify", verifyToken, async (req: Request, res: Response) => {
  res.json({ message: "Authenticated user", user: res.locals.jwtData });
});

authRoutes.get("/logout", verifyToken, async (req: Request, res: Response) => {
  const response = await logoutUser(res);
  res
    .status(response.statusCode)
    .json({ message: response.message, data: response.data });
});

authRoutes.get("/get-ws-token", verifyToken, (req: Request, res: Response) => {
  const token = req.signedCookies[dependencies.config.cookie.cookieName!];
  const decoded: any = jwt.verify(token, dependencies.config.cookie.jwtSecret!);
  const wsToken = jwt.sign(
    { userId: decoded.userId, email: decoded.email },
    dependencies.config.cookie.jwtSecret!,
    {
      expiresIn: decoded.exp - Math.floor(Date.now() / 1000),
    }
  );
  res.status(200).json({ wsToken });
});
export = authRoutes;