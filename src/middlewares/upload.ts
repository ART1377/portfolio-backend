// Updated upload middleware (middlewares/upload.ts)
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "../utils/cloudinary";
import { Request } from "express";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req: Request, file: any) => {
    const isPdf = file.mimetype === "application/pdf";
    return {
      folder: "portfolio_uploads",
      resource_type: isPdf ? "raw" : "image",
      public_id: `${file.fieldname}-${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}`,
      format: isPdf ? "pdf" : undefined, // Explicitly set format for PDFs
    };
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only PDF files for resumes
    if (file.fieldname === "resume" && file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed for resumes"));
    }
    cb(null, true);
  },
});
