// routes/hero.routes.ts
import { Router } from "express";
import { getHero, updateHero } from "../controllers/hero.controller";
import { upload } from "../middlewares/upload";
import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();
const router = Router();

router.get("/", getHero);
router.put("/", updateHero);

// Upload resume
router.post("/upload-resume", upload.single("resume"), async (req, res) => {
  try {
    const lang = req.body.lang;

    if (!["en", "fa"].includes(lang)) {
      return res.status(400).json({ message: "Invalid language code." });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    // Find the hero record for this language
    const hero = await prisma.hero.findUnique({
      where: { lang },
    });

    if (!hero) {
      return res
        .status(404)
        .json({ message: "Hero data not found for this language." });
    }

    // Define the upload path
    const uploadsDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filename = `resume-${lang}.pdf`;
    const filePath = path.join(uploadsDir, filename);

    // Move the uploaded file
    fs.renameSync(req.file.path, filePath);

    // Update the database
    await prisma.resume.upsert({
      where: { lang },
      update: {
        filename,
        path: filePath,
        heroId: hero.id,
      },
      create: {
        lang,
        filename,
        path: filePath,
        heroId: hero.id,
      },
    });

    res.json({ message: `Resume (${lang}) uploaded successfully.` });
  } catch (error) {
    console.error("Error uploading resume:", error);
    res.status(500).json({ message: "Failed to upload resume." });
  }
});

// Download resume
router.get("/resume", async (req, res) => {
  try {
    const lang = req.query.lang as string;

    if (!["en", "fa"].includes(lang)) {
      return res.status(400).send("Invalid language.");
    }

    // Get resume info from database
    const resume = await prisma.resume.findUnique({
      where: { lang },
    });

    if (!resume || !fs.existsSync(resume.path)) {
      return res.status(404).send("Resume not found.");
    }

    res.download(resume.path);
  } catch (error) {
    console.error("Error downloading resume:", error);
    res.status(500).send("Failed to download resume.");
  }
});

export default router;
