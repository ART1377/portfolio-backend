import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH!;
const JWT_SECRET = process.env.JWT_SECRET!;

export const loginController = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (username !== ADMIN_USERNAME) {
    return res.status(401).json({ errorCode: "INVALID_CREDENTIALS" });
  }

  try {
    const passwordMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);

    if (!passwordMatch) {
      return res.status(401).json({ errorCode: "INVALID_CREDENTIALS" });
    }

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1 hour
      path: "/",
    });

    return res.json({ success: true });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ errorCode: "INTERNAL_ERROR" });
  }
};

export const logoutController = (req: Request, res: Response) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });
  return res.json({ success: true });
};
