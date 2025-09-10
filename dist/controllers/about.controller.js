"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAbout = exports.getAbout = void 0;
const prisma_1 = require("../lib/helper/prisma");
const getAbout = async (req, res) => {
    try {
        const lang = req.query.lang || "en";
        if (!["en", "fa"].includes(lang)) {
            return res.status(400).json({ message: "Invalid language" });
        }
        const about = await prisma_1.prisma.about.findUnique({
            where: { lang },
            include: {
                descriptions: true,
                skills: true,
                features: true,
            },
        });
        if (!about) {
            return res.status(404).json({ message: "About data not found" });
        }
        // Transform the data to match your frontend expectations
        const localized = {
            description: about.descriptions.map((d) => d.content),
            skills: about.skills.map((s) => s.name),
            features: about.features.map((f) => ({
                icon: f.icon,
                title: f.title,
                description: f.description,
            })),
        };
        res.json(localized);
    }
    catch (error) {
        console.error("Error fetching about data:", error);
        res.status(500).json({ error: "Failed to fetch about data" });
    }
};
exports.getAbout = getAbout;
const updateAbout = async (req, res) => {
    try {
        const lang = req.query.lang || "en";
        if (!["en", "fa"].includes(lang)) {
            return res.status(400).json({ message: "Invalid language" });
        }
        const updatedData = req.body;
        // Use a transaction to ensure all operations succeed or fail together
        await prisma_1.prisma.$transaction(async (tx) => {
            // Upsert the main about record
            const about = await tx.about.upsert({
                where: { lang },
                update: {},
                create: { lang },
            });
            // Update descriptions
            if (updatedData.description) {
                // Delete existing descriptions
                await tx.aboutDescription.deleteMany({
                    where: { aboutId: about.id },
                });
                // Create new descriptions
                await tx.aboutDescription.createMany({
                    data: updatedData.description.map((content) => ({
                        content,
                        aboutId: about.id,
                    })),
                });
            }
            // Update skills
            if (updatedData.skills) {
                // Delete existing skills
                await tx.aboutSkill.deleteMany({
                    where: { aboutId: about.id },
                });
                // Create new skills
                await tx.aboutSkill.createMany({
                    data: updatedData.skills.map((name) => ({
                        name,
                        aboutId: about.id,
                    })),
                });
            }
            // Update features
            if (updatedData.features) {
                // Delete existing features
                await tx.aboutFeature.deleteMany({
                    where: { aboutId: about.id },
                });
                // Create new features
                await tx.aboutFeature.createMany({
                    data: updatedData.features.map((feature) => ({
                        icon: feature.icon,
                        title: feature.title,
                        description: feature.description,
                        aboutId: about.id,
                    })),
                });
            }
        });
        res.status(200).json({ message: "About data updated successfully" });
    }
    catch (error) {
        console.error("Error updating about data:", error);
        res.status(500).json({ error: "Failed to update about data" });
    }
};
exports.updateAbout = updateAbout;
