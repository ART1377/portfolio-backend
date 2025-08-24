import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const seedData = {
  en: {
    name: "Alex Johnson",
    initials: "AJ",
    roles: ["Frontend Developer", "React Enthusiast", "GSAP Animator"],
    bio: "I create beautiful, responsive web applications with modern technologies...",
    socials: {
      github: "https://github.com/your-username",
      linkedin: "https://linkedin.com/in/your-profile",
      email: "mailto:you@example.com",
    },
  },
  fa: {
    name: "الکس جانسون",
    initials: "ا.ج",
    roles: ["توسعه‌دهنده فرانت‌اند", "علاقه‌مند به ری‌اکت", "انیماتور GSAP"],
    bio: "من با استفاده از تکنولوژی‌های مدرن اپلیکیشن‌های زیبای واکنش‌گرا می‌سازم...",
    socials: {
      github: "https://github.com/your-username",
      linkedin: "https://linkedin.com/in/your-profile",
      email: "mailto:you@example.com",
    },
  },
};

async function main() {
  // Seed English hero
  await prisma.hero.upsert({
    where: { lang: "en" },
    update: {},
    create: {
      lang: "en",
      name: seedData.en.name,
      initials: seedData.en.initials,
      bio: seedData.en.bio,
      roles: seedData.en.roles.join(", "),
      socials: {
        create: Object.entries(seedData.en.socials).map(([platform, url]) => ({
          platform,
          url,
        })),
      },
    },
  });

  // Seed Farsi hero
  await prisma.hero.upsert({
    where: { lang: "fa" },
    update: {},
    create: {
      lang: "fa",
      name: seedData.fa.name,
      initials: seedData.fa.initials,
      bio: seedData.fa.bio,
      roles: seedData.fa.roles.join(", "),
      socials: {
        create: Object.entries(seedData.fa.socials).map(([platform, url]) => ({
          platform,
          url,
        })),
      },
    },
  });
}

main()
  .then(async () => {
    console.log("✅ Database seeded");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
