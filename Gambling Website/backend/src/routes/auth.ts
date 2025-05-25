import express from "express";
import auth from "../middleware/auth";
import tokenIsValid from "../middleware/tokenIsValid";
import { signup } from "../controllers/signup";
import { signin } from "../controllers/signin";
import { getDashboard } from "../controllers/dashboard";
import { createMatch , getMatches , getUser } from "../controllers/match";
import { placeBet } from '../controllers/placeBet';
import dotenv from "dotenv";
dotenv.config();

const authRouter = express.Router();

authRouter.post("/tokenIsValid", tokenIsValid);   // Token validation
authRouter.post("/signup", signup); //Signup route
authRouter.post("/signin",signin); //Signin route
authRouter.get("/dashboard",auth,getDashboard); //fetching data for Dashboard
authRouter.post("/createMatch",auth,createMatch); //creating new competition
authRouter.get("/getMatches",getMatches); //get all matches for bids
authRouter.get("/getUser",auth,getUser); //get user details
authRouter.post("/api/bet", placeBet); //p/acing bet function API


// authRouter.get("/protected", auth, (req, res) => {
//   res.json({ message: "You are authenticated", user: req.user });
// });
export default authRouter;