// routes/testCloudinary.ts
import { Router } from "express";
import cloudinary from "../utils/cloudinary";

const router = Router();

router.get("/cloudinary-test", async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(
      "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      { folder: "test" }
    );
    res.json({ success: true, result });
  } catch (err: any) {
    console.error("Cloudinary test failed:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
