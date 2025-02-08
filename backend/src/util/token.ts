import { NextFunction, Request, Response } from "express";
import jwt, {
    JsonWebTokenError,
    SignOptions,
    TokenExpiredError,
} from "jsonwebtoken";
import dependencies from "../infrastructure/dependencies";
import { serverError, unauthorizedError } from "../util/helper";
import { ITokenData } from "../util/interfaces";

const COOKIE_NAME: string =
  dependencies.config.cookie.cookieName || "auth_token";
const JWT_SECRET = dependencies.config.cookie.jwtSecret || "secret";
const ENVIRONMENT: string = dependencies.config.environment;

export const createToken = (
  data: ITokenData,
  expiresIn: string
): string => {
  return jwt.sign(data, JWT_SECRET, {
    expiresIn: expiresIn as SignOptions["expiresIn"],
  });
};

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.signedCookies[COOKIE_NAME!];
    if (!token || token.trim() == "") {
      unauthorizedError(res, "unauthorized");
    } else {
      const data = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

      const jwtData: ITokenData = {
        userId: data.id,
        email: data.email,
      };

      res.locals.jwtData = jwtData;
      next();
    }
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      unauthorizedError(res, "expired token");
    } else if (error instanceof JsonWebTokenError) {
      unauthorizedError(res, "invalid token");
    } else {
      serverError(res, error);
    }
  }
};

export const setTokenAndCookie = (
  res: Response,
  data: ITokenData,
  expiresIn: string
) => {
  res.clearCookie(COOKIE_NAME!, {
    path: "/",
    sameSite: "none",
    httpOnly: true,
    secure: ENVIRONMENT === "production",
    signed: true,
  });
  const token = createToken(data, expiresIn);
  const newDate = new Date();
  newDate.setDate(newDate.getDate() + 7);
  res.cookie(COOKIE_NAME!, token, {
    path: "/",
    expires: newDate,
    sameSite: "none",
    httpOnly: true,
    secure: true,
    signed: true,
  });
};