import { Router } from "express";
import { getExperiences, updateExperiences } from "../controllers/experiences.controller";
import { jwtAuth } from "../utils/jwtAuth";

const router = Router();

router.get("/", getExperiences);
router.put("/", jwtAuth, updateExperiences);

export default router;
