// controllers/resume.controller.ts
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
    const publicId = cloudinaryFile.filename; // This should be the public_id

    console.log("Upload details:", { lang, fileUrl, publicId }); // Debug log

    // Delete old resume file from Cloudinary if it exists
    try {
      const oldResume = await prisma.resume.findUnique({ where: { lang } });
      if (oldResume && oldResume.filename) {
        await cloudinary.uploader.destroy(oldResume.filename, {
          resource_type: "raw",
        });
      }
    } catch (deleteError) {
      console.warn("Could not delete old resume file:", deleteError);
      // Continue with upload even if deletion fails
    }

    await prisma.resume.upsert({
      where: { lang },
      update: {
        filename: publicId,
        path: fileUrl,
        heroId: hero.id,
      },
      create: {
        lang,
        filename: publicId,
        path: fileUrl,
        heroId: hero.id,
      },
    });

    res.json({
      message: `Resume (${lang}) uploaded successfully.`,
      url: fileUrl,
      publicId: publicId,
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

    // Get the resume from database
    const resume = await prisma.resume.findUnique({
      where: { lang },
    });

    if (!resume || !resume.filename) {
      return res.status(404).json({ message: "Resume not found." });
    }

    // Generate a signed URL for download from Cloudinary
    const signedUrl = cloudinary.url(resume.filename, {
      resource_type: 'raw',
      secure: true,
      flags: 'attachment',
      attachment: `Alireza-Tahavori-Resume-${lang}.pdf`,
      sign_url: true // This creates a signed URL
    });

    console.log('Generated download URL:', signedUrl); // Debug log

    // Redirect to the signed Cloudinary URL
    res.redirect(signedUrl);

  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ message: "Failed to download resume" });
  }
};