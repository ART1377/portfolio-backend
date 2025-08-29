import express from "express";
import { deleteImage, uploadImage } from "../controllers/image.controller";
import { jwtAuth } from "../utils/jwtAuth";
import { upload } from "../middlewares/upload"; // multer disk storage

const router = express.Router();


router.post("/upload", jwtAuth, upload.single("image"), uploadImage);
router.post("/delete", jwtAuth, deleteImage);

export default router;
