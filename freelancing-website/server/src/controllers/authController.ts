import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import { User } from "../models/User.js";
import { clearAuthCookie, setAuthCookie, signToken } from "../utils/auth.js";

function publicUser(user: any) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    headline: user.headline,
    bio: user.bio,
    location: user.location,
    skills: user.skills,
    languages: user.languages,
    rating: user.rating,
    completedProjects: user.completedProjects
  };
}

export async function register(req: Request, res: Response) {
  const { name, email, password, role = "freelancer" } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are required." });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters." });
  }

  if (!["freelancer", "employer"].includes(role)) {
    return res.status(400).json({ message: "Invalid role." });
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  const existing = await User.findOne({ email: normalizedEmail });

  if (existing) {
    return res.status(409).json({ message: "An account with this email already exists." });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await User.create({
    name: String(name).trim(),
    email: normalizedEmail,
    password: passwordHash,
    role
  });

  setAuthCookie(res, signToken(user));

  return res.status(201).json({ user: publicUser(user) });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const user = await User.findOne({ email: String(email).toLowerCase().trim() }).select("+password");

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  setAuthCookie(res, signToken(user));

  return res.json({ user: publicUser(user) });
}

export async function me(req: any, res: Response) {
  const user = await User.findById(req.user.id);

  if (!user) {
    clearAuthCookie(res);
    return res.status(401).json({ message: "User no longer exists." });
  }

  return res.json({ user: publicUser(user) });
}

export async function logout(_req: Request, res: Response) {
  clearAuthCookie(res);
  return res.json({ message: "Signed out." });
}
