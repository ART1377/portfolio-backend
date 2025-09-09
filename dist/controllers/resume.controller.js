"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadResume = exports.uploadResume = void 0;
const prisma_1 = require("../lib/helper/prisma");
const uploadResume = async (req, res) => {
    try {
        const lang = req.body.lang;
        if (!["en", "fa"].includes(lang)) {
            return res.status(400).json({ message: "Invalid language code." });
        }
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded." });
        }
        const hero = await prisma_1.prisma.hero.findUnique({ where: { lang } });
        if (!hero) {
            return res.status(404).json({ message: "Hero data not found." });
        }
        // Cloudinary gives us both public_id and path (url)
        const cloudinaryFile = req.file;
        const fileUrl = cloudinaryFile.path; // public URL
        const fileName = cloudinaryFile.filename || cloudinaryFile.originalname;
        await prisma_1.prisma.resume.upsert({
            where: { lang },
            update: { filename: fileName, path: fileUrl, heroId: hero.id },
            create: { lang, filename: fileName, path: fileUrl, heroId: hero.id },
        });
        res.json({
            message: `Resume (${lang}) uploaded successfully.`,
            url: fileUrl,
        });
    }
    catch (err) {
        console.error("Error uploading resume:", err);
        res.status(500).json({ message: "Failed to upload resume." });
    }
};
exports.uploadResume = uploadResume;
const downloadResume = async (req, res) => {
    try {
        const lang = req.query.lang;
        if (!["en", "fa"].includes(lang))
            return res.status(400).send("Invalid language.");
        const resume = await prisma_1.prisma.resume.findUnique({ where: { lang } });
        if (!resume)
            return res.status(404).send("Resume not found.");
        res.redirect(resume.path); // ✅ use `path` field
    }
    catch (err) {
        console.error("Error downloading resume:", err);
        res.status(500).send("Failed to download resume.");
    }
};
exports.downloadResume = downloadResume;
