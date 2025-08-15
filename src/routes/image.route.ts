import express from "express";
import { upload } from "../middlewares/upload";
import { deleteImage, uploadImage } from "../controllers/image.controller";

const router = express.Router();

router.post("/upload", upload.single("image"), uploadImage);
router.post("/delete",  deleteImage);

export default router;
