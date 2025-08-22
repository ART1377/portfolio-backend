import skillData from "../src/data/skills.json";
import { prisma } from "../src/lib/helper/prisma";

async function migrateSkillData() {
  try {
    console.log("Starting skill data migration...");

    for (const lang of ["en", "fa"] as const) {
      const data = skillData[lang];

      // Create skill record
      const skill = await prisma.skill.upsert({
        where: { lang },
        update: {},
        create: { lang }
      });

      // Migrate categories and skills
      if (data && data.length > 0) {
        for (const categoryData of data) {
          const newCategory = await prisma.skillCategory.create({
            data: {
              title: categoryData.title,
              skillId: skill.id
            }
          });

          // Migrate skills for this category
          if (categoryData.skills && categoryData.skills.length > 0) {
            await prisma.skillItem.createMany({
              data: categoryData.skills.map((skillItem: any) => ({
                name: skillItem.name,
                level: skillItem.level,
                skillCategoryId: newCategory.id
              }))
            });
          }
        }
      }

      console.log(`Skill data for ${lang} migrated successfully.`);
    }

    console.log("Skill data migration completed successfully!");
  } catch (error) {
    console.error("Skill data migration failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateSkillData();