import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "../utils/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const lang = req.body.lang || "general";

    return {
      folder: "portfolio_uploads", // all resumes/images go here
      resource_type: "auto", // supports pdf, images, videos
      public_id: `${file.fieldname}-${lang}-${Date.now()}`,
    };
  },
});

export const upload = multer({ storage });
