import { Request, Response } from "express";
import { prisma } from "../lib/helper/prisma";

// Updated uploadResume controller
export const uploadResume = async (req: Request, res: Response) => {
  try {
    const lang = req.body.lang;

    if (!["en", "fa"].includes(lang)) {
      return res.status(400).json({ message: "Invalid language code." });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    // Check if the uploaded file is a PDF
    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({ message: "Only PDF files are allowed." });
    }

    const hero = await prisma.hero.findUnique({ where: { lang } });
    if (!hero) {
      return res.status(404).json({ message: "Hero data not found." });
    }

    // Cloudinary gives us both public_id and path (url)
    const cloudinaryFile = req.file as any;
    const fileUrl = cloudinaryFile.path; // public URL
    const fileName = cloudinaryFile.originalname; // Use original filename

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
// Updated downloadResume controller
export const downloadResume = async (req: Request, res: Response) => {
  try {
    const lang = req.query.lang as string;
    if (!["en", "fa"].includes(lang))
      return res.status(400).send("Invalid language.");

    const resume = await prisma.resume.findUnique({ where: { lang } });
    if (!resume) return res.status(404).send("Resume not found.");

    // Set proper headers for PDF download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${resume.filename}"`
    );

    // Fetch the file from Cloudinary and pipe it to the response
    const response = await fetch(resume.path);
    const blob = await response.blob();
    const buffer = await blob.arrayBuffer();
    
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error("Error downloading resume:", err);
    res.status(500).send("Failed to download resume.");
  }
};