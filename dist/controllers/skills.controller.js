"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSkills = exports.getSkills = void 0;
const prisma_1 = require("../lib/helper/prisma");
const getSkills = async (req, res) => {
    try {
        const lang = req.query.lang || "en";
        if (!["en", "fa"].includes(lang)) {
            return res.status(400).json({ message: "Invalid language" });
        }
        const skillData = await prisma_1.prisma.skill.findUnique({
            where: { lang },
            include: {
                categories: {
                    include: {
                        skills: true,
                    },
                },
            },
        });
        if (!skillData) {
            return res.status(404).json({ message: "Skill data not found" });
        }
        // Transform the data to match your frontend expectations
        const localized = skillData.categories.map((category) => ({
            title: category.title,
            skills: category.skills.map((skill) => ({
                name: skill.name,
                level: skill.level,
            })),
        }));
        res.json(localized);
    }
    catch (error) {
        console.error("Error fetching skills:", error);
        res.status(500).json({ message: "Failed to fetch skills", error });
    }
};
exports.getSkills = getSkills;
const updateSkills = async (req, res) => {
    try {
        const lang = req.query.lang || "en";
        const newSkills = req.body;
        if (!["en", "fa"].includes(lang)) {
            return res.status(400).json({ message: "Invalid language" });
        }
        // Use a transaction to ensure all operations succeed or fail together
        await prisma_1.prisma.$transaction(async (tx) => {
            // Upsert the main skill record
            const skill = await tx.skill.upsert({
                where: { lang },
                update: {},
                create: { lang },
            });
            // Update categories and skills
            if (newSkills && Array.isArray(newSkills)) {
                // Delete existing categories and their skills
                const existingCategories = await tx.skillCategory.findMany({
                    where: { skillId: skill.id },
                });
                for (const category of existingCategories) {
                    await tx.skillItem.deleteMany({
                        where: { skillCategoryId: category.id },
                    });
                }
                await tx.skillCategory.deleteMany({
                    where: { skillId: skill.id },
                });
                // Create new categories and skills
                for (const categoryData of newSkills) {
                    const newCategory = await tx.skillCategory.create({
                        data: {
                            title: categoryData.title,
                            skillId: skill.id,
                        },
                    });
                    // Create skills for this category
                    if (categoryData.skills && categoryData.skills.length > 0) {
                        await tx.skillItem.createMany({
                            data: categoryData.skills.map((skillItem) => ({
                                name: skillItem.name,
                                level: skillItem.level,
                                skillCategoryId: newCategory.id,
                            })),
                        });
                    }
                }
            }
        });
        res.status(200).json({ message: "Skills updated successfully" });
    }
    catch (error) {
        console.error("Error updating skills:", error);
        res.status(500).json({ message: "Failed to update skills", error });
    }
};
exports.updateSkills = updateSkills;
