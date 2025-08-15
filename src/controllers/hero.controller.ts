import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import heroData from "../data/hero.json";

const filePath = path.join(__dirname, "../data/hero.json");

export const getHero = (req: Request, res: Response) => {
  const lang = (req.query.lang as string) || "en";
  
  if (!["en", "fa"].includes(lang))
    return res.status(400).json({ message: "Invalid language" });

  const localized = {
    ...heroData[lang as "en" | "fa"],
    socials: heroData.socials,
  };

  res.json(localized);
};

// In controllers/heroController.ts
export const updateHero = (req: Request, res: Response) => {
  try {
    const updated = req.body;
    const lang = updated?.lang as "en" | "fa";

    if (!lang || !["en", "fa"].includes(lang)) {
      return res.status(400).json({ error: "Invalid or missing language" });
    }

    const fileData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    fileData[lang] = updated;
    delete fileData[lang].lang; // remove 'lang' if present in body

    fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2));

    res.json({ message: "Hero data updated successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to update hero data." });
  }
};
