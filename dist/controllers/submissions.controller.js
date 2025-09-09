"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContactSubmission = exports.saveContactSubmission = exports.getContactSubmissions = void 0;
const prisma_1 = require("../lib/helper/prisma");
const getContactSubmissions = async (req, res) => {
    try {
        const submissions = await prisma_1.prisma.contactSubmission.findMany({
            orderBy: {
                submittedAt: "desc",
            },
        });
        // Transform the data to match your frontend expectations
        const transformedSubmissions = submissions.map((submission) => ({
            id: submission.id,
            name: submission.name,
            email: submission.email,
            subject: submission.subject,
            message: submission.message,
            submittedAt: submission.submittedAt.toISOString(),
        }));
        res.json(transformedSubmissions);
    }
    catch (error) {
        console.error("Error fetching submissions:", error);
        res.status(500).json({ message: "Failed to read submissions." });
    }
};
exports.getContactSubmissions = getContactSubmissions;
const saveContactSubmission = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: "All fields are required." });
        }
        const newSubmission = await prisma_1.prisma.contactSubmission.create({
            data: {
                name,
                email,
                subject,
                message,
                submittedAt: new Date(),
            },
        });
        // Transform the response to match frontend expectations
        const transformedSubmission = {
            id: newSubmission.id,
            name: newSubmission.name,
            email: newSubmission.email,
            subject: newSubmission.subject,
            message: newSubmission.message,
            submittedAt: newSubmission.submittedAt.toISOString(),
        };
        res.status(201).json({
            message: "Submission saved.",
            submission: transformedSubmission,
        });
    }
    catch (error) {
        console.error("Error saving submission:", error);
        res.status(500).json({ message: "Failed to save submission." });
    }
};
exports.saveContactSubmission = saveContactSubmission;
const deleteContactSubmission = async (req, res) => {
    try {
        const { id } = req.params;
        const submissionId = parseInt(id);
        if (isNaN(submissionId)) {
            return res.status(400).json({ message: "Invalid submission ID." });
        }
        const submission = await prisma_1.prisma.contactSubmission.findUnique({
            where: { id: submissionId },
        });
        if (!submission) {
            return res.status(404).json({ message: "Submission not found." });
        }
        const deletedSubmission = await prisma_1.prisma.contactSubmission.delete({
            where: { id: submissionId },
        });
        // Transform the response to match frontend expectations
        const transformedSubmission = {
            id: deletedSubmission.id,
            name: deletedSubmission.name,
            email: deletedSubmission.email,
            subject: deletedSubmission.subject,
            message: deletedSubmission.message,
            submittedAt: deletedSubmission.submittedAt.toISOString(),
        };
        res.status(200).json({
            message: "Submission deleted.",
            deleted: transformedSubmission,
        });
    }
    catch (error) {
        console.error("Error deleting submission:", error);
        res.status(500).json({ message: "Failed to delete submission." });
    }
};
exports.deleteContactSubmission = deleteContactSubmission;
