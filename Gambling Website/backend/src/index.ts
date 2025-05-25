import mongoose = require("mongoose");
import express from "express";
import { Request, Response } from "express";
import { outcomes } from "./outcomes";
import User from "./models/user";
import cors from "cors";
import authRouter from "./routes/auth";
import auth from "./middleware/auth";
import http from "http";
import { Server } from "socket.io";
import "./scheduler/matchScheduler";
import Match from "./models/match";
import { env } from "./config/env";

const app = express();
const PORT = env.port;
app.use(cors())
app.use(express.json());
app.use(authRouter);
const TOTAL_DROPS = 16;

// Use environment variable for database URI
const DB = env.mongodbUri;

if (!DB) {
  console.error("MONGODB_URI is not defined in environment variables");
  process.exit(1);
}

const MULTIPLIERS: {[ key: number ]: number} = {
    0: 16,
    1: 9,
    2: 2,
    3: 1.4,
    4: 1.4,
    5: 1.2,
    6: 1.1,
    7: 1,
    8: 0.5,
    9: 1,
    10: 1.1,
    11: 1.2,
    12: 1.4,
    13: 1.4,
    14: 2,
    15: 9,
    16: 16
}

interface AuthenticatedRequest extends Request {
  user?: string; 
}

app.post("/game",auth , async (req: AuthenticatedRequest, res: Response) => {
  try{  
    console.log("Inside game route");
    const userId = (req as any).user.id;
    console.log("req.user >>>", (req as any).user);
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.balance < 10) {
      return res.status(400).json({ message: "Insufficient balance" });
    }
    user.balance -= 10;
    let outcome = 0;
    const pattern = []
    for (let i = 0; i < TOTAL_DROPS; i++) {
        if (Math.random() > 0.5) {
            pattern.push("R")
            outcome++;
        } else {
            pattern.push("L")
        }
    }

    const multiplier = MULTIPLIERS[outcome];
    const possiblieOutcomes = outcomes[outcome];
    const reward = Math.round(10 * multiplier);
    user.balance += reward;
    console.log(multiplier,pattern,reward);

    // Update bet history
    user.betHistory.push({
      gameId: "PLINKO",
      gameName: "Plinko",
      amount: 10,
      status: reward >= 10 ? "Won" :"Lost",
      placedAt: new Date(),
    });
    await user.save();
    res.send({
        point: possiblieOutcomes[Math.floor(Math.random() * possiblieOutcomes.length || 0)],
        multiplier,
        pattern
    });
  }catch(err){
    console.error("Game error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Create raw HTTP server
const httpServer = http.createServer(app);

// Attach socket.io to this HTTP server
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // Adjust for production to your frontend origin
    methods: ["GET", "POST"],
  },
});

// Function to calculate odds for a match
function calculateMatchOdds(match: any) {
  const { betsSummary } = match;
  const timeframe = getCurrentTimeframe(match.startTime);
  
  const totalAmountA = Object.values(betsSummary.TeamA || {}).reduce(
    (sum: number, tf: any) => sum + (tf.totalAmount || 0),
    0
  );
  const totalAmountB = Object.values(betsSummary.TeamB || {}).reduce(
    (sum: number, tf: any) => sum + (tf.totalAmount || 0),
    0
  );
  const total = totalAmountA + totalAmountB;

  if (total === 0) {
    return { oddsA: 50, oddsB: 50 };
  }

  const oddsA = Math.round((totalAmountA * 100) / total);
  const oddsB = 100 - oddsA;

  // if(timeframe==0) {
  //     return { oddsA: 50, oddsB: 50 };
  // }

  return { oddsA, oddsB };
}

// Function to get current timeframe
function getCurrentTimeframe(startTime: string) {
  const now = new Date().getTime();
  const start = new Date(startTime).getTime();
  if (now < start) return 0;
  if (now < start + 300000) return 1; // 5 minutes
  if (now < start + 600000) return 2; // 10 minutes
  return 3;
}

// Emit odds updates every 2 seconds
setInterval(async () => {
  try {
    const matches = await Match.find({});
    const oddsUpdates = matches.map(match => ({
      matchId: match._id,
      odds: calculateMatchOdds(match)
    }));
    io.emit('sportsOddsUpdate', oddsUpdates);
  } catch (error) {
    console.error('Error calculating odds:', error);
  }
}, 2000);

io.on("connection", (socket) => {
  console.log("A client connected:", socket.id);
  
  // Send initial odds when client connects
  socket.on('requestInitialOdds', async () => {
    try {
      const matches = await Match.find({});
      const oddsUpdates = matches.map(match => ({
        matchId: match._id,
        odds: calculateMatchOdds(match)
      }));
      socket.emit('sportsOddsUpdate', oddsUpdates);
    } catch (error) {
      console.error('Error sending initial odds:', error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

mongoose
  .connect(DB)
  .then(() => console.log("✅ Connected to DB"))
  .catch((e: any) => console.error("DB Connection Error:", e));

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`connected at port ${PORT}`);
});