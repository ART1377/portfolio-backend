import { Request, Response } from "express";
import { prisma } from "../lib/helper/prisma";

export const getProjects = async (req: Request, res: Response) => {
  try {
    const lang = (req.query.lang as string) || "en";

    if (!["en", "fa"].includes(lang)) {
      return res.status(400).json({ message: "Invalid language" });
    }

    const projectData = await prisma.project.findUnique({
      where: { lang },
      include: {
        projects: {
          include: {
            technologies: true,
          },
        },
      },
    });

    if (!projectData) {
      return res.status(404).json({ message: "Project data not found" });
    }

    // Transform the data to match your frontend expectations
    const localized = projectData.projects.map((project) => ({
      id: project.id.toString(), // Convert to string to match frontend expectation
      title: project.title,
      description: project.description,
      image: project.image || "",
      technologies: project.technologies.map((tech) => tech.name),
      liveUrl: project.liveUrl || "#",
      githubUrl: project.githubUrl || "#",
    }));

    res.json(localized);
  } catch (error) {
    console.error("Error fetching project data:", error);
    res.status(500).json({ error: "Failed to read projects data." });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const lang = (req.query.lang as string) || "en";
    const newProjects = req.body;

    if (!["en", "fa"].includes(lang)) {
      return res.status(400).json({ message: "Invalid language" });
    }

    // Use a transaction to ensure all operations succeed or fail together
    await prisma.$transaction(async (tx) => {
      // Upsert the main project record
      const project = await tx.project.upsert({
        where: { lang },
        update: {},
        create: { lang },
      });

      // Update projects
      if (newProjects && Array.isArray(newProjects)) {
        // Delete existing projects and their technologies
        const existingProjects = await tx.projectItem.findMany({
          where: { projectId: project.id },
        });

        for (const proj of existingProjects) {
          await tx.projectTechnology.deleteMany({
            where: { projectItemId: proj.id },
          });
        }

        await tx.projectItem.deleteMany({
          where: { projectId: project.id },
        });

        // Create new projects
        for (const proj of newProjects) {
          const newProj = await tx.projectItem.create({
            data: {
              title: proj.title,
              description: proj.description,
              image: proj.image || "",
              liveUrl: proj.liveUrl || "#",
              githubUrl: proj.githubUrl || "#",
              projectId: project.id,
            },
          });

          // Create technologies
          if (proj.technologies && proj.technologies.length > 0) {
            await tx.projectTechnology.createMany({
              data: proj.technologies.map((tech: string) => ({
                name: tech,
                projectItemId: newProj.id,
              })),
            });
          }
        }
      }
    });

    res.json({ message: "Projects data updated successfully." });
  } catch (error) {
    console.error("Error updating project data:", error);
    res.status(500).json({ error: "Failed to update project data." });
  }
};
