import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface Submission {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: string;
}

export const getContactSubmissions = async (req: Request, res: Response) => {
  try {
    const submissions = await prisma.contactSubmission.findMany({
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
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ message: "Failed to read submissions." });
  }
};

export const saveContactSubmission = async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newSubmission = await prisma.contactSubmission.create({
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
  } catch (error) {
    console.error("Error saving submission:", error);
    res.status(500).json({ message: "Failed to save submission." });
  }
};

export const deleteContactSubmission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const submissionId = parseInt(id);

    if (isNaN(submissionId)) {
      return res.status(400).json({ message: "Invalid submission ID." });
    }

    const submission = await prisma.contactSubmission.findUnique({
      where: { id: submissionId },
    });

    if (!submission) {
      return res.status(404).json({ message: "Submission not found." });
    }

    const deletedSubmission = await prisma.contactSubmission.delete({
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
  } catch (error) {
    console.error("Error deleting submission:", error);
    res.status(500).json({ message: "Failed to delete submission." });
  }
};
