import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer, { FileFilterCallback } from "multer";
import cloudinary from "../utils/cloudinary";
import { Request } from "express";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req: Request, file: Express.Multer.File) => {
    return {
      folder: "portfolio_uploads", // Folder on Cloudinary
      resource_type: "auto", // Images, PDFs, etc.
      public_id: `${file.fieldname}-${Date.now()}`, // Unique name
    };
  },
});

export const upload = multer({ storage });
