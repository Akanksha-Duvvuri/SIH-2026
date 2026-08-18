import jwt from "jsonwebtoken";
import type { Response } from "express";
import type { IUser } from "../models/User.js";

const COOKIE_NAME = "fp_token";

function secret() {
  const value = process.env.JWT_SECRET;
  if (!value) throw new Error("JWT_SECRET is missing");
  return value;
}

export function signToken(user: IUser) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role, name: user.name },
    secret(),
    { expiresIn: "7d" }
  );
}

export function setAuthCookie(res: Response, token: string) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/"
  });
}

export function clearAuthCookie(res: Response) {
  res.clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, secret()) as { sub: string; role: string; name: string };
}

export { COOKIE_NAME };
