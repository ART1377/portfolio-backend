import { Request, Response } from "express";
import { prisma } from "../lib/helper/prisma";
import cloudinary from "../utils/cloudinary";

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
    const lang = req.query.lang as string;

    const publicId =
      lang === "en"
        ? "portfolio_uploads/Alireza Tahavori-en.pdf"
        : "portfolio_uploads/Alireza Tahavori-fa.pdf";

    // Generate URL with fl_attachment to force correct headers
    const url = cloudinary.url(publicId, {
      resource_type: "raw",
      flags: "attachment",
      secure: true,
    });

    return res.redirect(url);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch resume" });
  }
};

