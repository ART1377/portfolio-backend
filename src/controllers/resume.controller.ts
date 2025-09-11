import { Request, Response } from "express";
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

    // Cloudinary gives us both public_id and path (url)
    const cloudinaryFile = req.file as any;
    const fileUrl = cloudinaryFile.path; // public URL
    const fileName = cloudinaryFile.filename || cloudinaryFile.originalname;

    await prisma.resume.upsert({
      where: { lang },
      update: { filename: fileName, path: fileUrl, heroId: hero.id },
      create: { lang, filename: fileName, path: fileUrl, heroId: hero.id },
    });

    res.json({
      message: `Resume (${lang}) uploaded successfully.`,
      url: fileUrl,
    });
  } catch (err) {
    console.error("Error uploading resume:", err);
    res.status(500).json({ message: "Failed to upload resume." });
  }
};


export const downloadResume = async (req: Request, res: Response) => {
  try {
    const { lang } = req.query;

    if (!lang || typeof lang !== "string" || !["en", "fa"].includes(lang)) {
      return res.status(400).json({ message: "Invalid language code." });
    }

    // Get the resume URL from database
    const resume = await prisma.resume.findUnique({
      where: { lang },
    });

    if (!resume || !resume.path) {
      return res.status(404).json({ message: "Resume not found." });
    }

    // Redirect to Cloudinary URL with download parameters
    const downloadUrl = resume.path.replace(
      '/upload/',
      '/upload/fl_attachment:Alireza-Tahavori-Resume-' + lang + '.pdf/'
    );

    res.redirect(downloadUrl);

  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ message: "Failed to download resume" });
  }
};