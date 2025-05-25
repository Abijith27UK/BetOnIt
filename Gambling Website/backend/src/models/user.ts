import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";


interface Bet {
  gameId: string;
  gameName: string;
  amount: number;
  placedAt?: Date;
}

interface BetHistory extends Bet {
  status: "Won" | "Lost" | "Pending";
}

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  balance: number;
  currentBets: Bet[];
  betHistory: BetHistory[];
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      minlength: 2,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (value: string) =>
          /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value),
        message: "Please enter a valid email address",
      },
    },
    password: {
      type: String,
      required: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 10000,
    },
    currentBets: [
      {
        gameId: { type: String, required: true },
        gameName: { type: String, required: true },
        amount: { type: Number, required: true },
        placedAt: { type: Date, default: Date.now },
      },
    ],
    betHistory: [
      {
        gameId: { type: String, required: true },
        gameName: { type: String, required: true },
        amount: { type: Number, required: true },
        status: {
          type: String,
          enum: ["Won", "Lost", "Pending"],
          default: "Pending",
        },
        placedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { versionKey: false, timestamps: true }
);

//Hash the password before saving and bet history constrain
userSchema.pre<IUser>("save", async function (next) {
//   if (this.isModified("password")) {
//     const salt = await bcrypt.genSalt();
//     this.password = await bcrypt.hash(this.password, salt);
//   }
  if (this.betHistory && this.betHistory.length > 4) {
    this.betHistory = this.betHistory.slice(-4);
  }
  next();
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;