// controllers/image.controller.ts
import { Request, Response } from "express";
import { prisma } from "../lib/helper/prisma";
import cloudinary from "../utils/cloudinary";

export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const file = req.file as Express.Multer.File & {
      filename?: string;
      public_id?: string;
      secure_url?: string;
    };

    const fileUrl = file.secure_url!;
    const publicId = file.filename || file.public_id;

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
