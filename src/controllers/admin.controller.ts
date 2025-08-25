import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
const JWT_SECRET = process.env.JWT_SECRET;

if (!ADMIN_USERNAME || !ADMIN_PASSWORD_HASH || !JWT_SECRET) {
  console.error("Missing required environment variables for authentication");
  process.exit(1);
}

export const loginController = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({
      errorCode: "MISSING_CREDENTIALS",
      message: "Username and password are required",
    });
  }

  if (username !== ADMIN_USERNAME) {
    return res.status(401).json({
      errorCode: "INVALID_CREDENTIALS",
      message: "Invalid username or password",
    });
  }

  try {
    const passwordMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);

    if (!passwordMatch) {
      return res.status(401).json({
        errorCode: "INVALID_CREDENTIALS",
        message: "Invalid username or password",
      });
    }

   const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });

   return res.json({
     success: true,
     message: "Login successful",
     token,
   });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      errorCode: "INTERNAL_ERROR",
      message: "An internal server error occurred",
    });
  }
};

export const logoutController = (req: Request, res: Response) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
      path: "/",
    });

    return res.json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      errorCode: "INTERNAL_ERROR",
      message: "An internal server error occurred",
    });
  }
};
