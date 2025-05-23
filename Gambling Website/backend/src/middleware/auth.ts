import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: string;
  role: string;
  // add more fields if needed
}

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
  token?: string;
}

const auth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) {
      return res.status(401).json({ msg: "No auth token, access denied" });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    if (!verified) {
      return res.status(401).json({ msg: "Token verification failed, authorization denied." });
    }

    req.user = { id: verified.id, role: verified.role };
    req.token = token;

    next();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export default auth;