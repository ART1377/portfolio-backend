import { Request, Response } from "express";
import { prisma } from "../lib/helper/prisma";

export interface Suggestion {
  id: string;
  name: string;
}

export async function getSuggestions(req: Request, res: Response) {
  try {
    const q = ((req.query.query as string) || "").toLowerCase().trim();

    let suggestions;

    if (q) {
      // Search for suggestions that contain the query (case-insensitive)
      // Using raw SQL for case-insensitive search if Prisma doesn't support mode
      suggestions = await prisma.suggestion.findMany({
        where: {
          name: {
            contains: q,
            // mode: "insensitive" is not available in all Prisma versions
          },
        },
        orderBy: {
          name: "asc",
        },
      });

      // If the above doesn't work, filter case-insensitively in JavaScript
      if (suggestions.length === 0) {
        const allSuggestions = await prisma.suggestion.findMany({
          orderBy: { name: "asc" },
        });
        suggestions = allSuggestions.filter((suggestion) =>
          suggestion.name.toLowerCase().includes(q)
        );
      }
    } else {
      // Get all suggestions, ordered by name
      suggestions = await prisma.suggestion.findMany({
        orderBy: {
          name: "asc",
        },
        take: 100, // Limit to prevent too many results
      });
    }

    res.json(suggestions);
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    res.status(500).json({ error: "Failed to fetch suggestions" });
  }
}

export async function addSuggestion(req: Request, res: Response) {
  try {
    const { name } = req.body;

    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "Valid name is required" });
    }

    const trimmedName = name.trim();

    if (!trimmedName) {
      return res.status(400).json({ error: "Name cannot be empty" });
    }

    // Check if suggestion already exists (case-insensitive)
    // Get all suggestions and filter in JavaScript for case-insensitive check
    const allSuggestions = await prisma.suggestion.findMany();
    const existingSuggestion = allSuggestions.find(
      (s) => s.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (existingSuggestion) {
      return res.status(409).json({
        error: "Suggestion already exists",
        suggestion: existingSuggestion,
      });
    }

    // Create new suggestion
    const newSuggestion = await prisma.suggestion.create({
      data: {
        name: trimmedName,
      },
    });

    res.status(201).json(newSuggestion);
  } catch (error: any) {
    // Use type assertion for error
    console.error("Error adding suggestion:", error);

    // Handle unique constraint violation
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Suggestion already exists" });
    }

    res.status(500).json({ error: "Failed to add suggestion" });
  }
}

export async function deleteSuggestion(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }

    // Check if suggestion exists
    const existingSuggestion = await prisma.suggestion.findUnique({
      where: { id },
    });

    if (!existingSuggestion) {
      return res.status(404).json({ error: "Suggestion not found" });
    }

    // Delete the suggestion
    await prisma.suggestion.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Suggestion deleted successfully",
      deleted: existingSuggestion,
    });
  } catch (error: any) {
    // Use type assertion for error
    console.error("Error deleting suggestion:", error);

    // Handle not found error
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Suggestion not found" });
    }

    res.status(500).json({ error: "Failed to delete suggestion" });
  }
}
