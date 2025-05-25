import cron from "node-cron";
import Match from "../models/match";
import User from "../models/user";

// Using service logic instead of calling API endpoints
import { setMatchResult } from "../controllers/updateResult";
import { calculateResult } from "../controllers/calculateResult";

const timeframeDurations = [5 * 60 * 1000, 5 * 60 * 1000, 5 * 60 * 1000];
const matchDuration = timeframeDurations[1] + timeframeDurations[2];

cron.schedule("* * * * *", async () => {
  console.log("⏰ Cron running to check matches...");

  const now = Date.now();

  try {
    const pendingMatches = await Match.find({
      result: { $exists: false },
      startTime: { $lte: now - matchDuration }, // match should be completed
    });

    for (const match of pendingMatches) {
      try {
        console.log(`🎯 Processing match: ${match._id}`);
        const winner = Math.random() < 0.5 ? "TeamA" : "TeamB";// Simulate random winner
        const req = {
          body: { matchId: match._id, winner },
          user: { id: "68309786d555a5da95b20f49" },
        } as any;

        const res = {
          status: () => ({ json: () => {} }),
        } as any;

        await setMatchResult(req, res);
        await calculateResult(req, res);

        console.log(`✅ Match ${match._id} completed with winner ${winner}`);
      } catch (err) {
        console.error(`❌ Failed to process match ${match._id}`, err);
      }
    }
  } catch (error) {
    console.error("❌ Error fetching pending matches:", error);
  }
});
