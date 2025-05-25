import { Request, Response } from "express";
import Match from "../models/match";
import User from "../models/user";
import axios from "axios";

interface AuthenticatedRequest extends Request {
  user?: string; 
}

const timeframeDurations = [5 * 60 * 1000, 3 * 60 * 1000, 2 * 60 * 1000];

export const createMatch = async (req: AuthenticatedRequest, res: Response) => {
  try {
    console.log("Inside createMatch API");
    const userId = (req.user as any).id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const user = await User.findById(userId);
    if (!user || user.username !== "Admin" || user.email !== "Admin@admin.com") {
      return res.status(403).json({ message: "Only admin can create matches." });
    }
    const { gameName, teamA, teamB, startTime } = req.body;
    if (!gameName || !teamA || !teamB || !startTime) {
      return res.status(400).json({ message: "Missing required fields." });
    }
    const newMatch = new Match({ gameName, teamA, teamB, startTime });
    await newMatch.save();
    console.log("Match created successfully.", newMatch);
    res.status(201).json({ message: "Match created successfully.", match: newMatch });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error.", err });
  }
};

export const getMatches = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const matches = await Match.find({});
        res.status(200).json({ matches });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch matches." });
    }
};

export const getUser = async (req: AuthenticatedRequest, res: Response) => {
    try{
        console.log("Inside User finding API");
        const userId = (req.user as any).id;
        if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
        }
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        console.log("Found User",user);
        res.json({ user });
    }catch(err){
        console.error(err);
        res.status(500).json({ message: "Server error.",err });
    }  
};


