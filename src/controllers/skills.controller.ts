import { Request, Response } from "express";
import fs from "fs";
import path from "path";

const skillsPath = path.join(__dirname, "../data/skills.json");

export const getSkills = (req: Request, res: Response) => {
  try {
    const raw = fs.readFileSync(skillsPath, "utf-8");
    
    const data = JSON.parse(raw);
    const lang = (req.query.lang as string) || "en";
    const localizedSkills = data[lang];
    if (!localizedSkills) {
      console.warn(`No data found for lang=${lang}`);
      return res.status(404).json({ message: `No data for lang=${lang}` });
    }

    res.json(localizedSkills);
  } catch (error) {
    console.error("Error reading skills file:", error);
    res.status(500).json({ message: "Failed to fetch skills", error });
  }
};


export const updateSkills = (req: Request, res: Response) => {
  try {
    const lang = (req.query.lang as string) || "en";
    const raw = fs.readFileSync(skillsPath, "utf-8");
    const data = JSON.parse(raw);

    // Update only the selected language
    data[lang] = req.body;

    fs.writeFileSync(skillsPath, JSON.stringify(data, null, 2));
    res.status(200).json({ message: "Skills updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update skills", error: err });
  }
};
