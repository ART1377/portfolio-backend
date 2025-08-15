import { Request, Response } from "express";

export const getTest = (req: Request, res: Response) => {
  res.json({ message: "Hello from controller!" });
};
