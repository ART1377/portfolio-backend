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
    const { lang } = req.query;

    // Construct the public_id based on your naming convention
    const publicId = `portfolio_uploads/Alireza-Tahavori-${lang}`;

    // Get the secure URL from Cloudinary
    const result = await cloudinary.api.resource(publicId, {
      resource_type: "raw",
    });

    // Set proper headers for PDF download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="Alireza-Tahavori-Resume-${lang}.pdf"`
    );

    // Redirect to Cloudinary's secure URL
    res.redirect(result.secure_url);
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ message: "Failed to download resume" });
  }
};