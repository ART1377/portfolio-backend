// routes/hero.routes.ts
import { Router } from "express";
import { getHero, updateHero } from "../controllers/hero.controller";
import { upload } from "../middlewares/upload";
import { PrismaClient } from "@prisma/client";
import { downloadResume, uploadResume } from "../controllers/resume.controller";

const prisma = new PrismaClient();
const router = Router();

router.get("/", getHero);
router.put("/", updateHero);

// Resume upload (protected)
router.post("/upload-resume", upload.single("resume"), uploadResume);

// Resume download (public)
router.get("/resume", downloadResume);

export default router;
