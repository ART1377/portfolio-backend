// routes/hero.routes.ts
import { Router } from "express";
import { getHero, updateHero } from "../controllers/hero.controller";
import fs from "fs";
import path from "path";
import { upload } from "../middlewares/upload";

const router = Router();

router.get("/", getHero);
router.put("/", updateHero);

// Upload resume
router.post("/upload-resume", upload.single("resume"), (req, res) => {
  const lang = req.body.lang;

  if (!["en", "fa"].includes(lang)) {
    return res.status(400).json({ message: "Invalid language code." });
  }

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  const uploadedPath = path.join(__dirname, `../uploads/resume-${lang}.pdf`);
  fs.renameSync(req.file.path, uploadedPath);

  res.json({ message: `Resume (${lang}) uploaded successfully.` });
});



// Download resume
router.get("/resume", (req, res) => {
  const lang = req.query.lang;

  if (typeof lang !== "string" || !["en", "fa"].includes(lang)) {
    return res.status(400).send("Invalid language.");
  }

  const resumePath = path.join(__dirname, `../uploads/resume-${lang}.pdf`);

  if (fs.existsSync(resumePath)) {
    res.download(resumePath);
  } else {
    res.status(404).send("Resume not found.");
  }
});


export default router;
