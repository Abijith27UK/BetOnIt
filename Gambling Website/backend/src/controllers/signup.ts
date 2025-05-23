import { Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = "Secret";

export const signup = async (req: Request, res: Response):Promise<void> => {
  const { username, email, password } = req.body;
  console.log("New User",req.body);
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password : hashedPassword });
    await newUser.save();
    const token = jwt.sign(
      { id: email },
      JWT_SECRET as string, 
      { expiresIn: "7d" }
    );
    console.log("User created successfully",token , newUser);
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Signup failed", error: err });
  }
};
