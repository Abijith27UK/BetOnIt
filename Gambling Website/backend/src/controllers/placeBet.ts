import { Request, Response } from 'express';
import Match, { Team, TimeFrame } from '../models/match';
import User from '../models/user';

export const placeBet = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, matchId, team, amount, timeFrame, gameName } = req.body;

    // Validate team as 'TeamA' | 'TeamB'
    if (!["TeamA", "TeamB"].includes(team)) {
      res.status(400).json({ error: "Invalid team" });
      return;
    }

    if (![0, 1, 2].includes(timeFrame)) {
      res.status(400).json({ error: "Invalid timeframe" });
      return;
    }

    const match = await Match.findById(matchId);
    const user = await User.findById(userId);
    if (!match || !user) {
      res.status(404).json({ error: 'Match or User not found' });
      return;
    }

    const teamTyped = team as Team;
    const tf = timeFrame as TimeFrame;
    const opposingTeam: Team = teamTyped === "TeamA" ? "TeamB" : "TeamA";

    // Calculate total bets
    const totalTeamAmount = match.bets
      .filter(b => b.team === teamTyped)
      .reduce((sum, b) => sum + b.amount, 0);

    const totalOpposingAmount = match.bets
      .filter(b => b.team === opposingTeam)
      .reduce((sum, b) => sum + b.amount, 0);

    const newTotalTeamAmount = totalTeamAmount + amount;

    const oddsAtPlacement =
      totalOpposingAmount === 0 ? 50 : 50 * (newTotalTeamAmount / totalOpposingAmount);

    if (user.balance < amount) {
      res.status(400).json({ error: 'Insufficient balance' });
      return;
    }

    user.balance -= amount;

    match.bets.push({
      userId,
      team: teamTyped,
      amount,
      oddsAtPlacement,
      timeFrame: tf,
      placedAt: new Date(),
    });

    // Update betsSummary
    if (!match.betsSummary[teamTyped][tf]) {
      match.betsSummary[teamTyped][tf] = { totalAmount: 0, totalOdds: 0 };
    }

    match.betsSummary[teamTyped][tf].totalAmount += amount;
    match.betsSummary[teamTyped][tf].totalOdds += (100 - oddsAtPlacement);

    // Add to user's bet history
    user.betHistory.push({
      gameId: matchId,
      gameName,
      amount,
      status: 'Pending',
      placedAt: new Date(),
    });

    await user.save();
    await match.save();

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error placing bet:", error);
    res.status(500).json({ error: 'Server error placing bet' });
  }
};
