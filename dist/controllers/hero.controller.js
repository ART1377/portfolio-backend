"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateHero = exports.getHero = void 0;
const prisma_1 = require("../lib/helper/prisma");
const getHero = async (req, res) => {
    try {
        const lang = req.query.lang || "en";
        if (!["en", "fa"].includes(lang)) {
            return res.status(400).json({ message: "Invalid language" });
        }
        const hero = await prisma_1.prisma.hero.findUnique({
            where: { lang },
            include: {
                socials: true,
                resumes: true,
            },
        });
        if (!hero) {
            return res.status(404).json({ message: "Hero data not found" });
        }
        // Transform the data to match your frontend expectations
        const localized = {
            name: hero.name,
            initials: hero.initials,
            roles: hero.roles,
            bio: hero.bio,
            socials: hero.socials.reduce((acc, social) => {
                acc[social.platform] = social.url;
                return acc;
            }, {}),
        };
        res.json(localized);
    }
    catch (error) {
        console.error("Error fetching hero data:", error);
        res.status(500).json({ error: "Failed to fetch hero data" });
    }
};
exports.getHero = getHero;
const updateHero = async (req, res) => {
    try {
        const updated = req.body;
        const lang = updated?.lang;
        if (!lang || !["en", "fa"].includes(lang)) {
            return res.status(400).json({ error: "Invalid or missing language" });
        }
        // Upsert hero data
        const hero = await prisma_1.prisma.hero.upsert({
            where: { lang },
            update: {
                name: updated.name,
                initials: updated.initials,
                bio: updated.bio,
                roles: updated.roles,
            },
            create: {
                lang,
                name: updated.name,
                initials: updated.initials,
                bio: updated.bio,
                roles: updated.roles,
            },
        });
        // Update socials if provided
        if (updated.socials) {
            for (const [platform, url] of Object.entries(updated.socials)) {
                await prisma_1.prisma.social.upsert({
                    where: {
                        heroId_platform: {
                            heroId: hero.id,
                            platform,
                        },
                    },
                    update: { url: url },
                    create: {
                        platform,
                        url: url,
                        heroId: hero.id,
                    },
                });
            }
        }
        res.json({ message: "Hero data updated successfully." });
    }
    catch (err) {
        console.error("Error updating hero data:", err);
        res.status(500).json({ error: "Failed to update hero data." });
    }
};
exports.updateHero = updateHero;
