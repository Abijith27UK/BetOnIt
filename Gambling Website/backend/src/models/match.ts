import mongoose, { Document, Schema } from "mongoose";

export type TimeFrame = 0 | 1 | 2;
export type Team = "TeamA" | "TeamB";

interface OddsEntry {
  userId: string;
  team: Team;
  amount: number;
  oddsAtPlacement: number;
  timeFrame: TimeFrame;
  placedAt: Date;
}

interface BetsSummaryEntry {
  totalAmount: number;
  totalOdds: number; // sum of (100 - oddsAtPlacement)
}

interface BetsSummary {
//   TeamA: {
//     0: BetsSummaryEntry;
//     1: BetsSummaryEntry;
//     2: BetsSummaryEntry;
//   };
//   TeamB: {
//     0: BetsSummaryEntry;
//     1: BetsSummaryEntry;
//     2: BetsSummaryEntry;
//   };
  TeamA: { [key: number]: BetsSummaryEntry };
  TeamB: { [key: number]: BetsSummaryEntry };
}

export interface IMatch extends Document {
  gameName: string;
  teamA: string;
  teamB: string;
  startTime: Date;
  timeframeDurations: { [key in TimeFrame]: number };
  bets: OddsEntry[];
  betsSummary: BetsSummary;
  result?: Team;
}

const betsSummaryEntrySchema = {
  totalAmount: { type: Number, default: 0 },
  totalOdds: { type: Number, default: 0 },
};

const matchSchema = new Schema<IMatch>({
  gameName: { type: String, required: true },
  teamA: { type: String, required: true },
  teamB: { type: String, required: true },
  startTime: { type: Date, required: true },
  timeframeDurations: {
    0: { type: Number, required: true, default: 0 },
    1: { type: Number, required: true, default: 5 * 60 * 1000 },
    2: { type: Number, required: true, default: 5 * 60 * 1000 },
  },
  bets: [
    {
      userId: { type: String, required: true },
      team: { type: String, enum: ["TeamA", "TeamB"], required: true },
      amount: { type: Number, required: true },
      oddsAtPlacement: { type: Number, required: true },
      timeFrame: { type: Number, enum: [0, 1, 2], required: true },
      placedAt: { type: Date, default: Date.now },
    },
  ],
  betsSummary: {
    TeamA: {
      0: betsSummaryEntrySchema,
      1: betsSummaryEntrySchema,
      2: betsSummaryEntrySchema,
    },
    TeamB: {
      0: betsSummaryEntrySchema,
      1: betsSummaryEntrySchema,
      2: betsSummaryEntrySchema,
    },
  },
  result: { type: String, enum: ["TeamA", "TeamB"] },
});

const Match = mongoose.model<IMatch>("Match", matchSchema);
export default Match;
