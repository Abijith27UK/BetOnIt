import express from "express";
import auth from "../middleware/auth";
import tokenIsValid from "../middleware/tokenIsValid";
import { signup } from "../controllers/signup";
import { signin } from "../controllers/signin";
import { getDashboard } from "../controllers/dashboard";
import dotenv from "dotenv";
dotenv.config();

const authRouter = express.Router();

authRouter.post("/tokenIsValid", tokenIsValid);   // Token validation
authRouter.post("/signup", signup); //Signup route
authRouter.post("/signin",signin); //Signin route
authRouter.post("/dashboard",getDashboard);


// authRouter.get("/protected", auth, (req, res) => {
//   res.json({ message: "You are authenticated", user: req.user });
// });
export default authRouter;