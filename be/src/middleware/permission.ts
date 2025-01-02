import type { Request, Response, NextFunction } from "express";
import { getResResult } from "../utils/api";
import pool from "../config/database";

export const permission = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user?.id) {
      return res.status(401).send(getResResult(401, "Authentication required"));
    }

    const [rows]: any = await pool.query(
      "SELECT is_admin FROM Customer WHERE customer_id = ?",
      [req.user.id]
    );

    if (!rows.length || !rows[0].is_admin) {
      return res
        .status(403)
        .send(getResResult(403, "Administrator permission required"));
    }

    next();
  } catch (error) {
    res.status(500).send(getResResult(500, "Server error", null));
  }
};
