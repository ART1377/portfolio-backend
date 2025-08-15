import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { Lang } from "./about.controller";

const dataPath = path.join(__dirname, "../data/experiences.json");

const readData = () => JSON.parse(fs.readFileSync(dataPath, "utf-8"));

export const getExperiences = (req: Request, res: Response) => {
  try {
    const lang = (req.query.lang as Lang) || "en";
    const data = readData();
    res.json(data[lang] || data["en"]);
  } catch (err) {
    res.status(500).json({ error: "Failed to read experience data" });
  }
};

export const updateExperiences = (req: Request, res: Response) => {
  try {
    const lang = (req.query.lang as Lang) || "en";
    const newData = req.body;

    const data = readData();
    data[lang] = newData;

    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    res.status(200).json({ message: "Experiences updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update", error: err });
  }
};
