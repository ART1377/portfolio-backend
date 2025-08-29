// controllers/image.controller.ts
import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { prisma } from "../lib/helper/prisma";
import cloudinary from "../utils/cloudinary";

export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "projects",
    });

    // Delete local file after upload
    fs.unlinkSync(req.file.path);

    const fileUrl = uploadResult.secure_url;
    const publicId = uploadResult.public_id;

    const projectId = req.query.projectId as string;
    if (projectId) {
      await prisma.projectItem.update({
        where: { id: parseInt(projectId) },
        data: { image: fileUrl, imageId: publicId },
      });
    }

    res.json({ imageUrl: fileUrl, publicId });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
};


export const deleteImage = async (req: Request, res: Response) => {
  try {
    const { imageUrl, projectId } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: "No image URL provided" });
    }

    // Extract public_id from the URL
    // Example: https://res.cloudinary.com/demo/image/upload/v1234567/projects/abc123.jpg
    // → public_id = projects/abc123
    const publicIdMatch = imageUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
    const publicId = publicIdMatch ? publicIdMatch[1] : null;

    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }

    if (projectId) {
      await prisma.projectItem.update({
        where: { id: parseInt(projectId) },
        data: { image: "", imageId: null },
      });
    }

    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ error: "Failed to delete image" });
  }
};
