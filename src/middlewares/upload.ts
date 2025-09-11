// middlewares/upload.ts
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "../utils/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isPdf = file.mimetype === "application/pdf";
    const lang = req.body.lang; // Get language from request

    return {
      folder: "portfolio_uploads",
      resource_type: isPdf ? "raw" : "auto",
      public_id: isPdf
        ? `Alireza-Tahavori-Resume-${lang}` // Consistent naming with language
        : `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1e9)}`,
    };
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});
