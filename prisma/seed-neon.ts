// // prisma/seed-production.ts
// import { PrismaClient } from "@prisma/client";
// import fs from "fs";
// import path from "path";

// const prisma = new PrismaClient();

// // Helper function to read JSON files
// function readJsonFile<T>(filePath: string): T {
//   try {
//     const fullPath = path.join(process.cwd(), filePath);
//     const fileContent = fs.readFileSync(fullPath, "utf-8");
//     return JSON.parse(fileContent);
//   } catch (error) {
//     console.error(`Error reading file ${filePath}:`, error);
//     throw error;
//   }
// }

// async function seedProduction() {
//   console.log("🚀 Starting complete production seeding...");

//   try {
//     // Clear all existing data (in correct order to respect foreign keys)
//     console.log("🧹 Clearing existing data...");

//     // await prisma.contactSubmission.deleteMany();
//     // await prisma.suggestion.deleteMany();

//     // Clear project-related data
//     await prisma.projectTechnology.deleteMany();
//     await prisma.projectItem.deleteMany();
//     await prisma.project.deleteMany();


//     // // Clear skill-related data
//     // await prisma.skillItem.deleteMany();
//     // await prisma.skillCategory.deleteMany();
//     // await prisma.skill.deleteMany();

//     // Clear experience-related data
//     // await prisma.experienceTechnology.deleteMany();
//     // await prisma.experienceItem.deleteMany();
//     // await prisma.educationItem.deleteMany();
//     // await prisma.courseItem.deleteMany();
//     // await prisma.experience.deleteMany();


//     // Clear hero-related data
//     // await prisma.social.deleteMany();
//     // await prisma.hero.deleteMany();

//     // Clear about-related data
//     // await prisma.aboutDescription.deleteMany();
//     // await prisma.aboutSkill.deleteMany();
//     // await prisma.aboutFeature.deleteMany();
//     // await prisma.about.deleteMany();

//     // Clear contact info data
//     // await prisma.contactSocial.deleteMany();
//     // await prisma.contactInfo.deleteMany();

//     console.log("✅ Database cleared successfully");

//     // Seed Hero Section
//     // console.log("📝 Seeding Hero section...");
//     // const heroData = readJsonFile<Record<string, any>>("src/data/hero.json");

//     // for (const [lang, data] of Object.entries(heroData)) {
//     //   if (["en", "fa"].includes(lang)) {
//     //     // Convert roles array to string if needed
//     //     const rolesString = Array.isArray(data.roles)
//     //       ? data.roles.join(", ")
//     //       : data.roles;

//     //     const hero = await prisma.hero.upsert({
//     //       where: { lang },
//     //       update: {
//     //         name: data.name,
//     //         initials: data.initials,
//     //         bio: data.bio,
//     //         roles: rolesString, // Convert array to string
//     //       },
//     //       create: {
//     //         lang,
//     //         name: data.name,
//     //         initials: data.initials,
//     //         bio: data.bio,
//     //         roles: rolesString, // Convert array to string
//     //       },
//     //     });

//     //     // Seed social links
//     //     for (const [platform, url] of Object.entries(data.socials || {})) {
//     //       await prisma.social.upsert({
//     //         where: {
//     //           heroId_platform: {
//     //             heroId: hero.id,
//     //             platform: platform,
//     //           },
//     //         },
//     //         update: { url: url as string },
//     //         create: {
//     //           platform: platform,
//     //           url: url as string,
//     //           heroId: hero.id,
//     //         },
//     //       });
//     //     }
//     //   }
//     // }

//     // // Seed About Section
//     // console.log("📝 Seeding About section...");
//     // const aboutData = readJsonFile<Record<string, any>>("src/data/about.json");

//     // for (const [lang, data] of Object.entries(aboutData)) {
//     //   if (["en", "fa"].includes(lang)) {
//     //     const about = await prisma.about.upsert({
//     //       where: { lang },
//     //       update: {},
//     //       create: { lang },
//     //     });

//     //     // Seed descriptions
//     //     await prisma.aboutDescription.deleteMany({
//     //       where: { aboutId: about.id },
//     //     });
//     //     for (const description of data.description || []) {
//     //       await prisma.aboutDescription.create({
//     //         data: {
//     //           content: description,
//     //           aboutId: about.id,
//     //         },
//     //       });
//     //     }

//     //     // Seed skills
//     //     await prisma.aboutSkill.deleteMany({ where: { aboutId: about.id } });
//     //     for (const skill of data.skills || []) {
//     //       await prisma.aboutSkill.create({
//     //         data: {
//     //           name: skill,
//     //           aboutId: about.id,
//     //         },
//     //       });
//     //     }

//     //     // Seed features
//     //     await prisma.aboutFeature.deleteMany({ where: { aboutId: about.id } });
//     //     for (const feature of data.features || []) {
//     //       await prisma.aboutFeature.create({
//     //         data: {
//     //           icon: feature.icon,
//     //           title: feature.title,
//     //           description: feature.description,
//     //           aboutId: about.id,
//     //         },
//     //       });
//     //     }
//     //   }
//     // }

//     // // Seed Contact Info
//     // console.log("📝 Seeding Contact Info...");
//     // const contactInfoData = readJsonFile<Record<string, any>>(
//     //   "src/data/contactInfo.json"
//     // );

//     // for (const [lang, data] of Object.entries(contactInfoData)) {
//     //   if (["en", "fa"].includes(lang)) {
//     //     const contactInfo = await prisma.contactInfo.upsert({
//     //       where: { lang },
//     //       update: {
//     //         email: data.email,
//     //         phone: data.phone,
//     //         location: data.location,
//     //       },
//     //       create: {
//     //         lang,
//     //         email: data.email,
//     //         phone: data.phone,
//     //         location: data.location,
//     //       },
//     //     });

//     //     // Seed social links
//     //     for (const [platform, url] of Object.entries(data.social || {})) {
//     //       await prisma.contactSocial.upsert({
//     //         where: {
//     //           contactInfoId_platform: {
//     //             contactInfoId: contactInfo.id,
//     //             platform: platform,
//     //           },
//     //         },
//     //         update: { url: url as string },
//     //         create: {
//     //           platform: platform,
//     //           url: url as string,
//     //           contactInfoId: contactInfo.id,
//     //         },
//     //       });
//     //     }
//     //   }
//     // }

//     // // Seed Experiences
//     // console.log("📝 Seeding Experiences...");
//     // const experiencesData = readJsonFile<Record<string, any>>(
//     //   "src/data/experiences.json"
//     // );

//     // for (const [lang, data] of Object.entries(experiencesData)) {
//     //   if (["en", "fa"].includes(lang)) {
//     //     const experience = await prisma.experience.upsert({
//     //       where: { lang },
//     //       update: {},
//     //       create: { lang },
//     //     });

//     //     // Seed work experiences
//     //     for (const exp of data.experiences || []) {
//     //       const experienceItem = await prisma.experienceItem.create({
//     //         data: {
//     //           title: exp.title,
//     //           company: exp.company,
//     //           period: exp.period,
//     //           description: exp.description,
//     //           experienceId: experience.id,
//     //         },
//     //       });

//     //       for (const tech of exp.technologies || []) {
//     //         await prisma.experienceTechnology.create({
//     //           data: {
//     //             name: tech,
//     //             experienceItemId: experienceItem.id,
//     //           },
//     //         });
//     //       }
//     //     }

//     //     // Seed education
//     //     for (const edu of data.education || []) {
//     //       await prisma.educationItem.create({
//     //         data: {
//     //           degree: edu.degree,
//     //           school: edu.school,
//     //           period: edu.period,
//     //           description: edu.description,
//     //           experienceId: experience.id,
//     //         },
//     //       });
//     //     }

//     //     // Seed courses
//     //     for (const course of data.courses || []) {
//     //       await prisma.courseItem.create({
//     //         data: {
//     //           name: course.name,
//     //           org: course.org,
//     //           year: course.year,
//     //           experienceId: experience.id,
//     //         },
//     //       });
//     //     }
//     //   }
//     // }

//     // Seed Projects
//     console.log("📝 Seeding Projects...");
//     const projectsData = readJsonFile<Record<string, any>>(
//       "src/data/projects.json"
//     );

//     for (const [lang, projects] of Object.entries(projectsData)) {
//       if (["en", "fa"].includes(lang)) {
//         const project = await prisma.project.upsert({
//           where: { lang },
//           update: {},
//           create: { lang },
//         });

//         for (const proj of projects) {
//           const projectItem = await prisma.projectItem.create({
//             data: {
//               title: proj.title,
//               description: proj.description,
//               image: proj.image || "",
//               liveUrl: proj.liveUrl || "#",
//               githubUrl: proj.githubUrl || "#",
//               projectId: project.id,
//             },
//           });

//           for (const tech of proj.technologies || []) {
//             await prisma.projectTechnology.create({
//               data: {
//                 name: tech,
//                 projectItemId: projectItem.id,
//               },
//             });
//           }
//         }
//       }
//     }

//     // Seed Skills
//     // console.log("📝 Seeding Skills...");
//     // const skillsData = readJsonFile<Record<string, any>>(
//     //   "src/data/skills.json"
//     // );

//     // for (const [lang, categories] of Object.entries(skillsData)) {
//     //   if (["en", "fa"].includes(lang)) {
//     //     const skill = await prisma.skill.upsert({
//     //       where: { lang },
//     //       update: {},
//     //       create: { lang },
//     //     });

//     //     for (const category of categories) {
//     //       const skillCategory = await prisma.skillCategory.create({
//     //         data: {
//     //           title: category.title,
//     //           skillId: skill.id,
//     //         },
//     //       });

//     //       for (const skillItem of category.skills) {
//     //         await prisma.skillItem.create({
//     //           data: {
//     //             name: skillItem.name,
//     //             level: skillItem.level,
//     //             skillCategoryId: skillCategory.id,
//     //           },
//     //         });
//     //       }
//     //     }
//     //   }
//     // }

//     // Seed Suggestions
//     // console.log("📝 Seeding Suggestions...");
//     // const suggestionsData = readJsonFile<any[]>("src/data/suggestions.json");

//     // for (const suggestion of suggestionsData) {
//     //   try {
//     //     await prisma.suggestion.upsert({
//     //       where: { name: suggestion.name },
//     //       update: {},
//     //       create: {
//     //         name: suggestion.name,
//     //       },
//     //     });
//     //   } catch (error) {
//     //     // Skip duplicates
//     //     console.log(`Skipped duplicate suggestion: ${suggestion.name}`);
//     //   }
//     // }

//     // Seed Contact Submissions
//     // console.log("📝 Seeding Contact Submissions...");
//     // const submissionsData = readJsonFile<any[]>("src/data/submissions.json");

//     // for (const submission of submissionsData) {
//     //   await prisma.contactSubmission.create({
//     //     data: {
//     //       name: submission.name,
//     //       email: submission.email,
//     //       subject: submission.subject,
//     //       message: submission.message,
//     //       submittedAt: new Date(submission.submittedAt),
//     //     },
//     //   });
//     // }

//     console.log("🎉 Production seeding completed successfully!");
//     console.log("📊 Summary of seeded data:");
//     console.log("- Hero section with social links");
//     console.log("- About section with descriptions, skills, and features");
//     console.log("- Contact information with social links");
//     console.log("- Work experiences with technologies");
//     console.log("- Education and courses");
//     console.log("- Projects with technologies");
//     console.log("- Skills with categories and proficiency levels");
//     console.log("- Technology suggestions");
//     console.log("- Contact form submissions");
//   } catch (error) {
//     console.error("❌ Error during production seeding:", error);
//     throw error;
//   }
// }

// // Run the seed function
// seedProduction()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
