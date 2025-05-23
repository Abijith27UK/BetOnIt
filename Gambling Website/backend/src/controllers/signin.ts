import { Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const JWT_SECRET = "Secret";
export const signin = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  console.log("User Login",req.body);
  try {
    const user = await User.findOne({ username });
    console.log(user);
    if (!user)
      return res.status(400).json({ message: "Invalid username or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid username or password" });

    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET as string,
      { expiresIn: "1d" }
    );
    console.log("Successful Login",token, user.username);
    res.status(200).json({ token, username: user.username });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Signin failed", error: err });
  }
};
