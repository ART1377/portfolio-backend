import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { Lang } from "./about.controller";

const filePath = path.join(__dirname, "../data/contactInfo.json");

export const getContactInfo = (req: Request, res: Response) => {
  try {
    const lang = req.query.lang || "en";
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    res.json(data[lang as Lang] || data["en"]);
  } catch (err) {
    res.status(500).json({ error: "Failed to read contact info." });
  }
};

export const updateContactInfo = (req: Request, res: Response) => {
  try {
    const contactData = req.body;
    const lang = (req.query.lang as Lang) || "en";

    const contactInfo = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    contactInfo[lang] = {
      ...contactData,
      updatedAt: new Date().toISOString(), 
    };
    fs.writeFileSync(filePath, JSON.stringify(contactInfo, null, 2));

    res.status(200).json({ message: "Contact info updated" });
  } catch (err) {
    console.error(err); // <-- Add this to see real error on backend logs
    res.status(500).json({ error: "Failed to update contact info" });
  }
};
