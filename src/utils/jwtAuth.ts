import { Request, Response, NextFunction } from "express";
import { jwtVerify } from "jose";

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET environment variable is required");
  process.exit(1);
}

// Extend Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export async function jwtAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader?.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ errorCode: "NO_TOKEN", message: "Token required" });
    }

    const token = authHeader.split(" ")[1];
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    req.user = payload;
    next();
  } catch (err: any) {
    console.error("JWT verification error:", err);
    return res.status(403).json({
      errorCode: "INVALID_TOKEN",
      message: "Token is invalid or expired",
    });
  }
}
