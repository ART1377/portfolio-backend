// scripts/migrateHeroData.ts
import { PrismaClient } from "@prisma/client";
import heroData from "../src/data/hero.json";

const prisma = new PrismaClient();

async function migrateHeroData() {
  try {
    console.log("Starting hero data migration...");

    for (const lang of ["en", "fa"] as const) {
      const data = heroData[lang];
      const socials = heroData.socials;

      // Create hero record
      const hero = await prisma.hero.upsert({
        where: { lang },
        update: {
          name: data.name,
          initials: data.initials,
          bio: data.bio,
          roles: data.roles.join(","),
        },
        create: {
          lang,
          name: data.name,
          initials: data.initials,
          bio: data.bio,
          roles: data.roles.join(","),
        },
      });

      console.log(`Hero data for ${lang} migrated successfully.`);

      // Create social records
      for (const [platform, url] of Object.entries(socials)) {
        await prisma.social.upsert({
          where: {
            heroId_platform: {
              heroId: hero.id,
              platform,
            },
          },
          update: { url },
          create: {
            platform,
            url,
            heroId: hero.id,
          },
        });
      }

      console.log(`Social data for ${lang} migrated successfully.`);
    }

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateHeroData();
