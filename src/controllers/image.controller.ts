// controllers/image.controller.ts
import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { prisma } from "../lib/helper/prisma";
import cloudinary from "../utils/cloudinary";

export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "projects", // optional: put images in a folder
      resource_type: "image",
    });

    // Uploaded file URL
    const fileUrl = uploadResult.secure_url;

    // If this is a project image upload (contains projectId in query), update the database
    const projectId = req.query.projectId as string;
    if (projectId) {
      await prisma.projectItem.update({
        where: { id: parseInt(projectId) },
        data: { image: fileUrl },
      });
    }

    res.json({ imageUrl: fileUrl });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
};

// export const deleteImage = async (req: Request, res: Response) => {
//   try {
//     const { path: imagePath, projectId } = req.body;

//     if (!imagePath) {
//       return res.status(400).json({ error: "No path provided" });
//     }

//     // Resolve to absolute path on server
//     const fullPath = path.join(__dirname, "../", imagePath);

//     // Delete the file from filesystem
//     fs.unlink(fullPath, async (err) => {
//       if (err) {
//         console.error("Failed to delete image:", err);
//         return res.status(500).json({ error: "Failed to delete image" });
//       }

//       // If this is a project image, update the database
//       if (projectId) {
//         try {
//           await prisma.projectItem.update({
//             where: { id: parseInt(projectId) },
//             data: { image: "" },
//           });
//         } catch (dbError) {
//           console.error("Failed to update database:", dbError);
//           // Don't fail the request if DB update fails, as file is already deleted
//         }
//       }

//       res.json({ message: "Image deleted successfully" });
//     });
//   } catch (error) {
//     console.error("Error deleting image:", error);
//     res.status(500).json({ error: "Failed to delete image" });
//   }
// };


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
