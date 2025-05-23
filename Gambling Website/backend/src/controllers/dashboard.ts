import { Request, Response } from "express";
import User from "../models/user";

export const getDashboard = async (req: Request, res: Response) => {
  try {
    console.log("Inside Dashboard API");
    const userId = (req as any).user?.id; // set by tokenIsValid middleware
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const user = await User.findById(userId).select(
      "username email balance currentBets betHistory"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
