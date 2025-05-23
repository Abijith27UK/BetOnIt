import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";

interface JwtPayload {
  id: string;
  role: string;
}
const JWT_SECRET = "Secret";
const tokenIsValid = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

    const verified = jwt.verify(token, JWT_SECRET) as JwtPayload;
    if (!verified) return res.status(401).json({ error: "Token verification failed." });

    const user = await User.findById(verified.id);
    if (!user) return res.status(404).json({ error: "User not found." });

    // Attach user id to request object
    (req as any).user = verified.id;
    next();
  } catch (err: any) {
    return res.status(500).json({ error: "Internal server error: " + err.message });
  }
};

export default tokenIsValid;
