import { Router } from "express";
import {
  deleteContactSubmission,
  getContactSubmissions,
  saveContactSubmission,
} from "../controllers/submissions.controller";
import { jwtAuth } from "../utils/jwtAuth";

const router = Router();

router.get("/", getContactSubmissions);
router.post("/", saveContactSubmission);
router.delete("/:id", jwtAuth, deleteContactSubmission);

export default router;
