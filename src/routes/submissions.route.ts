import { Router } from "express";
import { deleteContactSubmission, getContactSubmissions, saveContactSubmission } from "../controllers/submissions.controller";

const router = Router();

router.get("/", getContactSubmissions);
router.post("/", saveContactSubmission);
router.delete("/:id", deleteContactSubmission);

export default router;
