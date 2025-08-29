// routes/hero.routes.ts
import { Router } from "express";
import { getHero, updateHero } from "../controllers/hero.controller";
import { upload } from "../middlewares/upload";
import { downloadResume, uploadResume } from "../controllers/resume.controller";
import { jwtAuth } from "../utils/jwtAuth";

const router = Router();

router.get("/", getHero);
router.put("/", jwtAuth, updateHero);

// Resume upload (protected)
router.post("/upload-resume", jwtAuth, upload.single("resume"), uploadResume);

// Resume download (public)
router.get("/resume", downloadResume);

export default router;
