import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/secrets";
import { getResResult } from "../utils/api";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).send(getResResult(401, "Authentication required"));
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    const message =
      error instanceof jwt.JsonWebTokenError
        ? "Invalid token"
        : "Token expired";
    res.status(401).send(getResResult(401, message, null));
  }
};
