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

    // Cloudinary already gives us a public URL
    const cloudinaryUrl = (req.file as any).path;

    const filename = (req.file as any).originalname || path.basename(cloudinaryUrl);

    await prisma.resume.upsert({
      where: { lang },
      update: { path: cloudinaryUrl, heroId: hero.id, filename },
      create: { lang, path: cloudinaryUrl, heroId: hero.id, filename },
    });

    res.json({
      message: `Resume (${lang}) uploaded successfully.`,
      url: cloudinaryUrl,
    });
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
    if (!resume) return res.status(404).send("Resume not found.");

    res.redirect(resume.path); // redirect to Cloudinary file
  } catch (err) {
    console.error("Error downloading resume:", err);
    res.status(500).send("Failed to download resume.");
  }
};
