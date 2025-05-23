import mongoose = require("mongoose");
import express from "express";
import { outcomes } from "./outcomes";
import cors from "cors";
import authRouter from "./routes/auth";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);
app.use(cors())
app.use(express.json());
app.use(authRouter);
const TOTAL_DROPS = 16;

const DB = "mongodb+srv://fiitjeeb02:4EnTAfOlGfwUTwe4@betonit.ehovkwp.mongodb.net/"; 

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

app.post("/game", (req, res) => {
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

    res.send({
        point: possiblieOutcomes[Math.floor(Math.random() * possiblieOutcomes.length || 0)],
        multiplier,
        pattern
    });
});

mongoose
  .connect(DB)
  .then(() => console.log("✅ Connected to DB"))
  .catch((e: any) => console.error("DB Connection Error:", e));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`connected at port ${PORT}`);
});