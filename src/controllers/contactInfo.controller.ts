import { Request, Response } from "express";
import { prisma } from "../lib/helper/prisma";

export const getContactInfo = async (req: Request, res: Response) => {
  try {
    const lang = (req.query.lang as string) || "en";

    if (!["en", "fa"].includes(lang)) {
      return res.status(400).json({ message: "Invalid language" });
    }

    const contactInfo = await prisma.contactInfo.findUnique({
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
      }, {} as Record<string, string>),
      updatedAt: contactInfo.updatedAt.toISOString(),
    };

    res.json(localized);
  } catch (error) {
    console.error("Error fetching contact info:", error);
    res.status(500).json({ error: "Failed to read contact info." });
  }
};

export const updateContactInfo = async (req: Request, res: Response) => {
  try {
    const contactData = req.body;
    const lang = (req.query.lang as string) || "en";

    if (!["en", "fa"].includes(lang)) {
      return res.status(400).json({ message: "Invalid language" });
    }

    // Use a transaction to ensure all operations succeed or fail together
    await prisma.$transaction(async (tx) => {
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
              url: url as string,
              contactInfoId: contactInfo.id,
            })),
          });
        }
      }
    });

    res.status(200).json({ message: "Contact info updated successfully" });
  } catch (error) {
    console.error("Error updating contact info:", error);
    res.status(500).json({ error: "Failed to update contact info" });
  }
};
