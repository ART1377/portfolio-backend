"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSuggestions = getSuggestions;
exports.addSuggestion = addSuggestion;
exports.deleteSuggestion = deleteSuggestion;
const prisma_1 = require("../lib/helper/prisma");
async function getSuggestions(req, res) {
    try {
        const q = (req.query.query || "").toLowerCase().trim();
        let suggestions;
        if (q) {
            // Search for suggestions that contain the query (case-insensitive)
            // Using raw SQL for case-insensitive search if Prisma doesn't support mode
            suggestions = await prisma_1.prisma.suggestion.findMany({
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
                const allSuggestions = await prisma_1.prisma.suggestion.findMany({
                    orderBy: { name: "asc" },
                });
                suggestions = allSuggestions.filter((suggestion) => suggestion.name.toLowerCase().includes(q));
            }
        }
        else {
            // Get all suggestions, ordered by name
            suggestions = await prisma_1.prisma.suggestion.findMany({
                orderBy: {
                    name: "asc",
                },
                take: 100, // Limit to prevent too many results
            });
        }
        res.json(suggestions);
    }
    catch (error) {
        console.error("Error fetching suggestions:", error);
        res.status(500).json({ error: "Failed to fetch suggestions" });
    }
}
async function addSuggestion(req, res) {
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
        const allSuggestions = await prisma_1.prisma.suggestion.findMany();
        const existingSuggestion = allSuggestions.find((s) => s.name.toLowerCase() === trimmedName.toLowerCase());
        if (existingSuggestion) {
            return res.status(409).json({
                error: "Suggestion already exists",
                suggestion: existingSuggestion,
            });
        }
        // Create new suggestion
        const newSuggestion = await prisma_1.prisma.suggestion.create({
            data: {
                name: trimmedName,
            },
        });
        res.status(201).json(newSuggestion);
    }
    catch (error) {
        // Use type assertion for error
        console.error("Error adding suggestion:", error);
        // Handle unique constraint violation
        if (error.code === "P2002") {
            return res.status(409).json({ error: "Suggestion already exists" });
        }
        res.status(500).json({ error: "Failed to add suggestion" });
    }
}
async function deleteSuggestion(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "ID is required" });
        }
        // Check if suggestion exists
        const existingSuggestion = await prisma_1.prisma.suggestion.findUnique({
            where: { id },
        });
        if (!existingSuggestion) {
            return res.status(404).json({ error: "Suggestion not found" });
        }
        // Delete the suggestion
        await prisma_1.prisma.suggestion.delete({
            where: { id },
        });
        res.json({
            success: true,
            message: "Suggestion deleted successfully",
            deleted: existingSuggestion,
        });
    }
    catch (error) {
        // Use type assertion for error
        console.error("Error deleting suggestion:", error);
        // Handle not found error
        if (error.code === "P2025") {
            return res.status(404).json({ error: "Suggestion not found" });
        }
        res.status(500).json({ error: "Failed to delete suggestion" });
    }
}
