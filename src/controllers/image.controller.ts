// controllers/image.controller.ts
import { Request, Response } from "express";
import { prisma } from "../lib/helper/prisma";
import cloudinary from "../utils/cloudinary";
import fs from "fs";


export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "portfolio_uploads", // optional
      resource_type: "image",
    });

    // Remove local file after upload
    fs.unlinkSync(req.file.path);

    const fileUrl = result.secure_url; // this is the Cloudinary URL
    const publicId = result.public_id;

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
