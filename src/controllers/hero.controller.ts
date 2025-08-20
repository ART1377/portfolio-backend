import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getHero = async (req: Request, res: Response) => {
  try {
    const lang = (req.query.lang as string) || "en";

    if (!["en", "fa"].includes(lang)) {
      return res.status(400).json({ message: "Invalid language" });
    }

    const hero = await prisma.hero.findUnique({
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
      }, {} as Record<string, string>),
    };

    res.json(localized);
  } catch (error) {
    console.error("Error fetching hero data:", error);
    res.status(500).json({ error: "Failed to fetch hero data" });
  }
};

export const updateHero = async (req: Request, res: Response) => {
  try {
    const updated = req.body;
    const lang = updated?.lang as "en" | "fa";

    if (!lang || !["en", "fa"].includes(lang)) {
      return res.status(400).json({ error: "Invalid or missing language" });
    }

    // Upsert hero data
    const hero = await prisma.hero.upsert({
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
        await prisma.social.upsert({
          where: {
            heroId_platform: {
              heroId: hero.id,
              platform,
            },
          },
          update: { url: url as string },
          create: {
            platform,
            url: url as string,
            heroId: hero.id,
          },
        });
      }
    }

    res.json({ message: "Hero data updated successfully." });
  } catch (err) {
    console.error("Error updating hero data:", err);
    res.status(500).json({ error: "Failed to update hero data." });
  }
};
