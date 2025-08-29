import express from "express";
import { upload } from "../middlewares/upload";
import { deleteImage, uploadImage } from "../controllers/image.controller";
import { jwtAuth } from "../utils/jwtAuth";

const router = express.Router();

router.post("/upload", jwtAuth, upload.single("image"), uploadImage);
router.post("/delete", jwtAuth, deleteImage);

export default router;
