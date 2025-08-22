import { Request, Response } from "express";
import { prisma } from "../lib/helper/prisma";

export const getExperiences = async (req: Request, res: Response) => {
  try {
    const lang = (req.query.lang as string) || "en";

    if (!["en", "fa"].includes(lang)) {
      return res.status(400).json({ message: "Invalid language" });
    }

    const experienceData = await prisma.experience.findUnique({
      where: { lang },
      include: {
        experiences: {
          include: {
            technologies: true,
          },
        },
        education: true,
        courses: true,
      },
    });

    if (!experienceData) {
      return res.status(404).json({ message: "Experience data not found" });
    }

    // Transform the data to match your frontend expectations
    const localized = {
      experiences: experienceData.experiences.map((exp) => ({
        title: exp.title,
        company: exp.company,
        period: exp.period,
        description: exp.description,
        technologies: exp.technologies.map((tech) => tech.name),
      })),
      education: experienceData.education.map((edu) => ({
        degree: edu.degree,
        school: edu.school,
        period: edu.period,
        description: edu.description,
      })),
      courses: experienceData.courses.map((course) => ({
        name: course.name,
        org: course.org,
        year: course.year,
      })),
    };

    res.json(localized);
  } catch (error) {
    console.error("Error fetching experience data:", error);
    res.status(500).json({ error: "Failed to read experience data" });
  }
};

export const updateExperiences = async (req: Request, res: Response) => {
  try {
    const lang = (req.query.lang as string) || "en";
    const newData = req.body;

    if (!["en", "fa"].includes(lang)) {
      return res.status(400).json({ message: "Invalid language" });
    }

    // Use a transaction to ensure all operations succeed or fail together
    await prisma.$transaction(async (tx) => {
      // Upsert the main experience record
      const experience = await tx.experience.upsert({
        where: { lang },
        update: {},
        create: { lang },
      });

      // Update experiences
      if (newData.experiences) {
        // Delete existing experiences and their technologies
        const existingExperiences = await tx.experienceItem.findMany({
          where: { experienceId: experience.id },
        });

        for (const exp of existingExperiences) {
          await tx.experienceTechnology.deleteMany({
            where: { experienceItemId: exp.id },
          });
        }

        await tx.experienceItem.deleteMany({
          where: { experienceId: experience.id },
        });

        // Create new experiences
        for (const exp of newData.experiences) {
          const newExp = await tx.experienceItem.create({
            data: {
              title: exp.title,
              company: exp.company,
              period: exp.period,
              description: exp.description,
              experienceId: experience.id,
            },
          });

          // Create technologies
          if (exp.technologies && exp.technologies.length > 0) {
            await tx.experienceTechnology.createMany({
              data: exp.technologies.map((tech: string) => ({
                name: tech,
                experienceItemId: newExp.id,
              })),
            });
          }
        }
      }

      // Update education
      if (newData.education) {
        // Delete existing education
        await tx.educationItem.deleteMany({
          where: { experienceId: experience.id },
        });

        // Create new education
        await tx.educationItem.createMany({
          data: newData.education.map((edu: any) => ({
            degree: edu.degree,
            school: edu.school,
            period: edu.period,
            description: edu.description,
            experienceId: experience.id,
          })),
        });
      }

      // Update courses
      if (newData.courses) {
        // Delete existing courses
        await tx.courseItem.deleteMany({
          where: { experienceId: experience.id },
        });

        // Create new courses
        await tx.courseItem.createMany({
          data: newData.courses.map((course: any) => ({
            name: course.name,
            org: course.org,
            year: course.year,
            experienceId: experience.id,
          })),
        });
      }
    });

    res.status(200).json({ message: "Experiences updated successfully" });
  } catch (error) {
    console.error("Error updating experiences:", error);
    res.status(500).json({ message: "Failed to update", error });
  }
};
