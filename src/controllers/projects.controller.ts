import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { Lang } from "./about.controller";
import { v4 as uuidv4 } from "uuid"; // npm install uuid

const filePath = path.join(__dirname, "../data/projects.json");

const readData = () => JSON.parse(fs.readFileSync(filePath, "utf-8"));

const writeData = (data: any) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

export const getProjects = (req: Request, res: Response) => {
  try {
    const lang = (req.query.lang as Lang) || "en";
    const data = readData();

    // Ensure every project has an ID
    let updated = false;
    data[lang] = data[lang].map((project: any) => {
      if (!project.id) {
        project.id = uuidv4();
        updated = true;
      }
      return project;
    });

    if (updated) {
      writeData(data);
    }

    res.json(data[lang] || data["en"]);
  } catch (err) {
    res.status(500).json({ error: "Failed to read projects data." });
  }
};

export const updateProject = (req: Request, res: Response) => {
  try {
    const lang = (req.query.lang as Lang) || "en";
    const newProjects = req.body;

    const data = readData();
    data[lang] = newProjects;

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    res.json({ message: "Projects data updated successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to update project data." });
  }
};
