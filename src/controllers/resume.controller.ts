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
    const publicId = `portfolio_uploads/Alireza-Tahavori-${lang}`;

    // Get the download URL
    const url = cloudinary.url(publicId, {
      resource_type: "raw",
      flags: "attachment:Alireza-Tahavori-Resume-" + lang + ".pdf",
    });

    // Fetch the file from Cloudinary
    const response = await fetch(url);
    const blob = await response.blob();

    // Set headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="Alireza-Tahavori-Resume-${lang}.pdf"`
    );
    res.setHeader("Content-Length", blob.size);

    // Convert blob to buffer and send
    const buffer = await blob.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ message: "Failed to download resume" });
  }
};