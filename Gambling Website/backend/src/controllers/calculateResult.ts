import { Request, Response } from 'express';
import Match from '../models/match';
import User, { IUser } from '../models/user';

export const calculateResult = async (req: Request, res: Response): Promise<void> => {
  try {
    const { matchId } = req.body;
    console.log("Inside calculateResult API");

    const match = await Match.findById(matchId);
    if (!match || !match.result) {
      res.status(400).json({ error: "Match not finished or winner not set." });
      return;
    }

    const winner = match.result; // 'TeamA' or 'TeamB'
    const loser = winner === 'TeamA' ? 'TeamB' : 'TeamA';

    const winningBets: typeof match.bets = [];
    const losingBets: typeof match.bets = [];

    for (const bet of match.bets) {
    if (bet.team === winner) {
        winningBets.push(bet);
    } else if (bet.team === loser) {
        losingBets.push(bet);
    }
    }
    const riskFactor = [3 / 6, 2 / 6, 1 / 6];

    const totalWinningAmountByTF: number[] = [];
    const totalLosingAmountByTF: number[] = [];

    for (let tf = 0; tf < 3; tf++) {
        totalWinningAmountByTF[tf] = match.betsSummary?.[winner]?.[tf]?.totalAmount || 0;
        totalLosingAmountByTF[tf] = match.betsSummary?.[loser]?.[tf]?.totalAmount || 0;
    }

    const userMap: Record<string, any> = {};

    for (const bet of winningBets) {
      const userId = bet.userId.toString();
      let user = userMap[userId];

      if (!user) {
        user = await User.findById(userId);
        if (!user) continue;
        userMap[userId] = user;
      }

      const tf = bet.timeFrame;
      const totalWinningAmount = totalWinningAmountByTF[tf];
      const totalLosingAmount = totalLosingAmountByTF[tf];

      if (totalWinningAmount === 0) continue;

      const share = bet.amount / totalWinningAmount;
      const rewardFromLosers = totalLosingAmount * riskFactor[tf] * share;
      const finalReward = bet.amount + rewardFromLosers;

      user.balance += finalReward;

      const betHist = user.betHistory.find((h: IUser["betHistory"][number]) =>
            h.gameId.toString() === matchId.toString() &&
            h.amount === bet.amount &&
            h.placedAt &&
            bet.placedAt
      );
      if (betHist) {
        betHist.status = "Won";
      }
    }

    for (const bet of losingBets) {
      const userId = bet.userId.toString();
      let user = userMap[userId];

      if (!user) {
        user = await User.findById(userId);
        if (!user) continue;
        userMap[userId] = user;
      }

      const betHist = user.betHistory.find(
        (h: IUser["betHistory"][number]) =>
            h.gameId.toString() === matchId.toString() &&
            h.amount === bet.amount &&
            h.placedAt &&
            bet.placedAt
        );

      if (betHist) {
        betHist.status = "Lost";
      }
    }

    const updates = Object.values(userMap).map((u: any) => u.save());
    await Promise.all(updates);

    res.status(200).json({ message: "Results calculated and balances updated." });

  } catch (error) {
    console.error("❌ Error calculating result:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
