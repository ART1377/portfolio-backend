import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function jwtAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  if (!authHeader?.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ errorCode: "NO_TOKEN", message: "Token required" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
    (req as any).user = payload;
    next();
  } catch (err) {
    return res
      .status(403)
      .json({
        errorCode: "INVALID_TOKEN",
        message: "Token is invalid or expired",
      });
  }
}
