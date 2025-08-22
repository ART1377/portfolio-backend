// prisma/seed-skills.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const skillsData = {
  en: [
    {
      title: "Frontend",
      skills: [
        { name: "React", level: 95 },
        { name: "Next.js", level: 80 },
        { name: "TypeScript", level: 85 },
        { name: "JavaScript", level: 95 },
        { name: "HTML/CSS", level: 98 },
      ],
    },
    {
      title: "Styling",
      skills: [
        { name: "Tailwind CSS", level: 92 },
        { name: "Styled Components", level: 85 },
        { name: "SASS/SCSS", level: 88 },
        { name: "CSS Modules", level: 80 },
        { name: "Framer Motion", level: 75 },
      ],
    },
    {
      title: "Tools & Others",
      skills: [
        { name: "Git", level: 90 },
        { name: "Webpack", level: 75 },
        { name: "Jest", level: 80 },
        { name: "Figma", level: 85 },
        { name: "Node.js", level: 70 },
      ],
    },
  ],
  fa: [
    {
      title: "فرانت‌اند",
      skills: [
        { name: "ری‌اکت", level: 90 },
        { name: "نکست.جی‌اس", level: 80 },
        { name: "تایپ‌اسکریپت", level: 85 },
        { name: "جاوااسکریپت", level: 95 },
        { name: "اچ‌تی‌ام‌ال/سی‌اس‌اس", level: 98 },
      ],
    },
    {
      title: "استایلینگ",
      skills: [
        { name: "تِیلویند سی‌اس‌اس", level: 92 },
        { name: "استایلد کامپوننتس", level: 85 },
        { name: "ساس/اس‌سی‌اس‌اس", level: 88 },
        { name: "ماژول‌های CSS", level: 80 },
        { name: "فریمر موشن", level: 75 },
      ],
    },
    {
      title: "ابزارها و سایر موارد",
      skills: [
        { name: "گیت", level: 90 },
        { name: "وب‌پک", level: 75 },
        { name: "جست", level: 80 },
        { name: "فیگما", level: 85 },
        { name: "نود.جی‌اس", level: 70 },
      ],
    },
  ],
};

async function seedSkills() {
  console.log("Start seeding skills...");

  try {
    // Clear existing data
    await prisma.skill.deleteMany();
    console.log("Cleared existing skills data");

    // Seed data for each language
    for (const [lang, categories] of Object.entries(skillsData)) {
      console.log(`Seeding ${lang} skills...`);

      // Create main skill record for this language
      const skill = await prisma.skill.create({
        data: {
          lang,
        },
      });

      // Seed categories and skills
      for (const categoryData of categories) {
        const skillCategory = await prisma.skillCategory.create({
          data: {
            title: categoryData.title,
            skillId: skill.id,
          },
        });

        // Seed skills for this category
        for (const skillData of categoryData.skills) {
          await prisma.skillItem.create({
            data: {
              name: skillData.name,
              level: skillData.level,
              skillCategoryId: skillCategory.id,
            },
          });
        }

        console.log(
          `Seeded category: ${categoryData.title} with ${categoryData.skills.length} skills`
        );
      }

      console.log(`Seeded ${categories.length} categories for ${lang}`);
    }

    console.log("Skills seeding finished successfully!");
  } catch (error) {
    console.error("Error seeding skills:", error);
    throw error;
  }
}

// Run the seed function
seedSkills()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
