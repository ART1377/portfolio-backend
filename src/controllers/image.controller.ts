import { Request, Response } from "express";
import fs from "fs";
import path from "path";

export const uploadImage = (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const filePath = `/uploads/${req.file.filename}`;
  res.json({ imageUrl: filePath });
};



export const deleteImage = (req: Request, res: Response) => {
  const { path: imagePath } = req.body;
  if (!imagePath) return res.status(400).json({ error: "No path provided" });

  // Resolve to absolute path on server
  const fullPath = path.join(__dirname, "../", imagePath);

  fs.unlink(fullPath, (err) => {
    if (err) {
      console.error("Failed to delete image:", err);
      return res.status(500).json({ error: "Failed to delete image" });
    }
    res.json({ message: "Image deleted successfully" });
  });
};
