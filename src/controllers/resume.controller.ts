import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { prisma } from "../lib/helper/prisma";


export const uploadResume = async (req: Request, res: Response) => {
  try {
    const lang = req.body.lang;

    if (!["en", "fa"].includes(lang)) {
      return res.status(400).json({ message: "Invalid language code." });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const hero = await prisma.hero.findUnique({ where: { lang } });
    if (!hero) {
      return res.status(404).json({ message: "Hero data not found." });
    }

    const uploadsDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadsDir))
      fs.mkdirSync(uploadsDir, { recursive: true });

    const filename = `resume-${lang}.pdf`;
    const filePath = path.join(uploadsDir, filename);

    fs.renameSync(req.file.path, filePath);

    await prisma.resume.upsert({
      where: { lang },
      update: { filename, path: filePath, heroId: hero.id },
      create: { lang, filename, path: filePath, heroId: hero.id },
    });

    res.json({ message: `Resume (${lang}) uploaded successfully.` });
  } catch (err) {
    console.error("Error uploading resume:", err);
    res.status(500).json({ message: "Failed to upload resume." });
  }
};

export const downloadResume = async (req: Request, res: Response) => {
  try {
    const lang = req.query.lang as string;
    if (!["en", "fa"].includes(lang))
      return res.status(400).send("Invalid language.");

    const resume = await prisma.resume.findUnique({ where: { lang } });
    if (!resume || !fs.existsSync(resume.path))
      return res.status(404).send("Resume not found.");

    res.download(resume.path);
  } catch (err) {
    console.error("Error downloading resume:", err);
    res.status(500).send("Failed to download resume.");
  }
};
