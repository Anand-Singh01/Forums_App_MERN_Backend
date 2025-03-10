// This is for user, login, sign up, check validation.
// Then in userAuth it uses them from here.
//use the token.ts,  once user logs in, use setTokenAndCookie to give them one. and after signup do it too. for setToken i need email 
// open IToken thing, userId is the _id generated by mongo, and email. that is being put in the token.'//We will identify the poster user
// through the token/cookie.
//Saving user and hash code in repo.

import bcrypt from "bcrypt";
import { Response } from "express";
import { User } from "../../domain/models/user";
import { ILoginUser, IRegisterUser, ServiceResponse } from "../../util/interfaces";
import { setTokenAndCookie } from "../../util/token";
import dependencies from "../dependencies";

export const registerUser = async (data: IRegisterUser, res:Response): Promise<ServiceResponse> => {
  let response: ServiceResponse = { status: true, statusCode: 200, message: "User created", data: null };

  try {
    const existingUser = await User.findOne({ email:data.email });
    const {dob, email, firstName, lastName, password, userName} = data;
    if (existingUser) {
      response.statusCode = 401;
      throw new Error("User already exists");
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      userName,
      password: hashedPassword,
      firstName,
      lastName,
      email,
      dob,
    });

    const savedUser = await newUser.save();
    setTokenAndCookie(res, {email, userId: savedUser._id.toString()}, "7d");
    response.data = { _id: savedUser._id, email: savedUser.email };
  } catch (error) {
    response.status = false;
    response.message = (error as Error).message;
    if (!response.statusCode || response.statusCode === 200) {
      response.statusCode = 500;
    }
  }
  return response;
};

export const loginUser = async (data: ILoginUser, res: Response): Promise<ServiceResponse> => {
  let response: ServiceResponse = { status: true, statusCode: 200, message: "Login successful", data: null };

  try {
    const { email, password } = data;

    const user = await User.findOne({ email });

    if (!user) {
      response.statusCode = 401;
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      response.statusCode = 401;
      throw new Error("Invalid credentials");
    }

    // Generate token and set cookie
    setTokenAndCookie(res, { userId: user._id.toString(), email: email }, "7d");

    response.data = { _id: user._id, email: user.email };
  } catch (error) {
    response.status = false;
    response.message = (error as Error).message;
    response.statusCode = response.statusCode === 200 ? 500 : response.statusCode;
  }
  return response;
};

export const logoutUser = async (res: Response): Promise<ServiceResponse> => {
  let response: ServiceResponse = { status: true, statusCode: 200, message: "User logged out", data: null };

  try {
    res.clearCookie(dependencies.config.cookie.cookieName!, {
      httpOnly: true,
      secure:true,
    });
  } catch (error) {
    response.status = false;
    response.message = (error as Error).message;
    response.statusCode = 500;
  }
  return response;
};