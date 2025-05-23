import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: {
    id: string;
    role?: string;
  };
}
const JWT_SECRET = "Secret";
const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.status(401).json({ msg: "No auth token, access denied" });

    const verified = jwt.verify(token, JWT_SECRET as string);
    if (!verified || typeof verified !== "object") return res.status(401).json({ msg: "Token verification failed" });

    req.user = { id: (verified as any).id, role: (verified as any).role };
    next();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export default auth;