import type { NextFunction, Request, Response } from "express";
import { COOKIE_NAME, verifyToken } from "../utils/auth.js";

export interface AuthRequest extends Request {
  user?: { id: string; role: string; name: string };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.[COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.sub, role: payload.role, name: payload.name };
    next();
  } catch {
    return res.status(401).json({ message: "Session expired. Please sign in again." });
  }
}
