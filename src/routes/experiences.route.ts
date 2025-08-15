import { Router } from "express";
import { getExperiences, updateExperiences } from "../controllers/experiences.controller";

const router = Router();

router.get("/", getExperiences);
router.put("/", updateExperiences);

export default router;
