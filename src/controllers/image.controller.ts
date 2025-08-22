// controllers/image.controller.ts
import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { prisma } from "../lib/helper/prisma";

export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = `/uploads/${req.file.filename}`;

    // If this is a project image upload (contains projectId in query), update the database
    const projectId = req.query.projectId as string;
    if (projectId) {
      await prisma.projectItem.update({
        where: { id: parseInt(projectId) },
        data: { image: filePath },
      });
    }

    res.json({ imageUrl: filePath });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
};

export const deleteImage = async (req: Request, res: Response) => {
  try {
    const { path: imagePath, projectId } = req.body;

    if (!imagePath) {
      return res.status(400).json({ error: "No path provided" });
    }

    // Resolve to absolute path on server
    const fullPath = path.join(__dirname, "../", imagePath);

    // Delete the file from filesystem
    fs.unlink(fullPath, async (err) => {
      if (err) {
        console.error("Failed to delete image:", err);
        return res.status(500).json({ error: "Failed to delete image" });
      }

      // If this is a project image, update the database
      if (projectId) {
        try {
          await prisma.projectItem.update({
            where: { id: parseInt(projectId) },
            data: { image: "" },
          });
        } catch (dbError) {
          console.error("Failed to update database:", dbError);
          // Don't fail the request if DB update fails, as file is already deleted
        }
      }

      res.json({ message: "Image deleted successfully" });
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ error: "Failed to delete image" });
  }
};
