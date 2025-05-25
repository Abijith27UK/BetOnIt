import { Request, Response } from 'express';
import Match, { Team, TimeFrame } from '../models/match';
import User from '../models/user';

interface AuthenticatedRequest extends Request {
  user?: string; 
}

export const setMatchResult = async (req: AuthenticatedRequest, res: Response) => {
  try {
    console.log("Inside match result setting API");
    const { matchId, winner } = req.body;    
    const userId = (req.user as any).id;
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const user = await User.findById(userId);
    if (!user) {
      res.status(403).json({ error: "User doesnt exist" });
      return;
    }   
    if (!user || user.username !== "Admin" || user.email !== "Admin@admin.com") {
      res.status(403).json({ error: "Only admin can set match results." });
      return;
    }

    if (!["TeamA", "TeamB"].includes(winner)) {
      res.status(400).json({ error: "Invalid winner team." });
      return;
    }

    const match = await Match.findById(matchId);
    if (!match) {
      res.status(404).json({ error: "Match not found." });
      return;
    }
    if(match.result) {
        res.status(200).json({ error: "Match already has a winner" });
        return;
    }
    match.result = winner;
    await match.save();

    res.status(200).json({ message: "Winner set successfully." });

  } catch (error) {
    console.error("Error setting match result:", error);
    res.status(500).json({ error: "Server error" });
  }
};
