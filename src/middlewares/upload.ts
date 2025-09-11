// middlewares/upload.ts
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "../utils/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isPdf = file.mimetype === "application/pdf";
    const lang = req.body.lang; // Get language from request

    if (isPdf && lang) {
      return {
        folder: "portfolio_uploads",
        resource_type: "raw",
        public_id: `Alireza-Tahavori-Resume-${lang}`, // Include language in public_id
      };
    }

    // For non-PDF files or missing lang
    return {
      folder: "portfolio_uploads",
      resource_type: "auto",
      public_id: `${file.fieldname}-${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}`,
    };
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});
