import fs from "fs";
import path from "path";
import { Request, Response } from "express";

const filePath = path.join(__dirname, "../data/suggestions.json");

export interface Suggestion {
  id: string;
  name: string;
}

function readSuggestions(): Suggestion[] {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as Suggestion[];
}

function writeSuggestions(data: Suggestion[]) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export function getSuggestions(req: Request, res: Response) {
  const q = (req.query.query as string || "").toLowerCase();
  const suggestions = readSuggestions();
  if (q) {
    return res.json(suggestions.filter((s: Suggestion) => s.name.toLowerCase().includes(q)));
  }
  res.json(suggestions);
}

export function addSuggestion(req: Request, res: Response) {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Name is required" });
  const suggestions = readSuggestions();
  const newItem: Suggestion = { id: Date.now().toString(), name };
  suggestions.push(newItem);
  writeSuggestions(suggestions);
  res.status(201).json(newItem);
}

// export function updateSuggestion(req: Request, res: Response) {
//   const { id } = req.params;
//   const { name } = req.body;
//   if (!name) return res.status(400).json({ error: "Name is required" });
//   let suggestions = readSuggestions();
//   suggestions = suggestions.map((s: Suggestion) => (s.id === id ? { ...s, name } : s));
//   writeSuggestions(suggestions);
//   res.json({ success: true });
// }

export function deleteSuggestion(req: Request, res: Response) {
  const { id } = req.params;
  const suggestions = readSuggestions().filter((s: Suggestion) => s.id !== id);
  writeSuggestions(suggestions);
  res.json({ success: true });
}
