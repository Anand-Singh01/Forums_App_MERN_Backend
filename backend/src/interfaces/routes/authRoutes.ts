import express, { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../../domain/models/user';
import jwt from 'jsonwebtoken';
import { loginUser, logoutUser, registerUser } from '../../infrastructure/respositories/userRepository';
import { serverError, unauthorizedError, success, badRequest } from '../../util/helper';
import { ILoginUser, IRegisterUser } from '../../util/interfaces';
import { verifyToken } from '../../util/token';



const authRoutes = express.Router();

authRoutes.post("/register", async (req: Request, res: Response) => {
  try {
    const data : IRegisterUser = req.body;
    const response = await registerUser(data, res);
    res.status(response.statusCode).json({ message: response.message, data: response.data });
  } catch (error) {
    serverError(res, error);
  }
});

authRoutes.post("/login", async (req: Request, res: Response) => {
  try {
    const data : ILoginUser = req.body;
    const response = await loginUser(data, res);
    res.status(response.statusCode).json({ message: response.message, data: response.data });
  } catch (error) {
    serverError(res, error);
  }
});

authRoutes.get("/verify", verifyToken, async (req: Request, res: Response) => {
  res.json({ message: "Authenticated user", user: res.locals.jwtData });
});

authRoutes.get("/logout", verifyToken, async (req: Request, res: Response) => {
  const response =  await logoutUser(res);
  res.status(response.statusCode).json({ message: response.message, data: response.data });
});


export = authRoutes;

