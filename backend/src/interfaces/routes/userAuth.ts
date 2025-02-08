import bcrypt from "bcrypt";
import express, { NextFunction, Request, Response } from "express";
import { User } from "../../domain/models/user";

const router = express.Router();

router.post(
  "/create",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userName, password, firstName, lastName, email, userId, dob } =
        req.body;

      if (
        !userName ||
        !password ||
        !firstName ||
        !lastName ||
        !email ||
        !userId
      ) {
        return res
          .status(400)
          .json({ message: "Please make sure to input all required fields" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        userId: userId,
        userName,
        password: hashedPassword,
        firstName,
        lastName,
        email,
        dob,
      });

      await newUser.save();

      res.status(201).json({ message: "User created", user: newUser });
    } catch (error) {
      console.error(`Error creating user: ${(error as Error).message}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findOne({ userName: req.body.userName });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isPasswordValid = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
      }

      res.status(200).json({
        message: "Logged in successfully",
        user,
      });
    } catch (error) {
      console.error(`Error logging in: ${(error as Error).message}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export = router;