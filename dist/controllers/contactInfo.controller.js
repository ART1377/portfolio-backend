"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateContactInfo = exports.getContactInfo = void 0;
const prisma_1 = require("../lib/helper/prisma");
const getContactInfo = async (req, res) => {
    try {
        const lang = req.query.lang || "en";
        if (!["en", "fa"].includes(lang)) {
            return res.status(400).json({ message: "Invalid language" });
        }
        const contactInfo = await prisma_1.prisma.contactInfo.findUnique({
            where: { lang },
            include: {
                socials: true,
            },
        });
        if (!contactInfo) {
            return res.status(404).json({ message: "Contact info not found" });
        }
        // Transform the data to match your frontend expectations
        const localized = {
            email: contactInfo.email,
            phone: contactInfo.phone,
            location: contactInfo.location,
            social: contactInfo.socials.reduce((acc, social) => {
                acc[social.platform] = social.url;
                return acc;
            }, {}),
            updatedAt: contactInfo.updatedAt.toISOString(),
        };
        res.json(localized);
    }
    catch (error) {
        console.error("Error fetching contact info:", error);
        res.status(500).json({ error: "Failed to read contact info." });
    }
};
exports.getContactInfo = getContactInfo;
const updateContactInfo = async (req, res) => {
    try {
        const contactData = req.body;
        const lang = req.query.lang || "en";
        if (!["en", "fa"].includes(lang)) {
            return res.status(400).json({ message: "Invalid language" });
        }
        // Use a transaction to ensure all operations succeed or fail together
        await prisma_1.prisma.$transaction(async (tx) => {
            // Upsert the main contact info record
            const contactInfo = await tx.contactInfo.upsert({
                where: { lang },
                update: {
                    email: contactData.email,
                    phone: contactData.phone,
                    location: contactData.location,
                },
                create: {
                    lang,
                    email: contactData.email,
                    phone: contactData.phone,
                    location: contactData.location,
                },
            });
            // Update social links
            if (contactData.social) {
                // Delete existing social links
                await tx.contactSocial.deleteMany({
                    where: { contactInfoId: contactInfo.id },
                });
                // Create new social links
                const socialEntries = Object.entries(contactData.social);
                if (socialEntries.length > 0) {
                    await tx.contactSocial.createMany({
                        data: socialEntries.map(([platform, url]) => ({
                            platform,
                            url: url,
                            contactInfoId: contactInfo.id,
                        })),
                    });
                }
            }
        });
        res.status(200).json({ message: "Contact info updated successfully" });
    }
    catch (error) {
        console.error("Error updating contact info:", error);
        res.status(500).json({ error: "Failed to update contact info" });
    }
};
exports.updateContactInfo = updateContactInfo;
