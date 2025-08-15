import fs from "fs";
import path from "path";
import { Request, Response } from "express";
import aboutData from "../data/about.json";

const dataPath = path.join(__dirname, "../data/about.json");
export type Lang = "en" | "fa";

export const getAbout = (req: Request, res: Response) => {
  const lang = (req.query.lang as string) || "en";
  if (!["en", "fa"].includes(lang))
    return res.status(400).json({ message: "Invalid language" });

  const localized = aboutData[lang as Lang];
  if (!localized)
    return res.status(404).json({ message: "About data not found" });

  res.json(localized);
};

export const updateAbout = (req: Request, res: Response) => {
  const lang = (req.query.lang as Lang) || "en";
  if (!["en", "fa"].includes(lang))
    return res.status(400).json({ message: "Invalid language" });

  const updatedLangData = req.body;

  fs.readFile(dataPath, "utf8", (readErr, fileContent) => {
    if (readErr) {
      return res.status(500).json({ message: "Failed to read data" });
    }

    let fullData: Record<Lang, any>;
    try {
      fullData = JSON.parse(fileContent);
    } catch (parseErr) {
      return res.status(500).json({ message: "Invalid JSON format" });
    }

    fullData[lang] = updatedLangData;

    fs.writeFile(dataPath, JSON.stringify(fullData, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to write data" });
      }
      res.status(200).json({ message: "About data updated" });
    });
  });
};
