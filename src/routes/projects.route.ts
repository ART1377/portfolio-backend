import { Router } from "express";
import { getProjects, updateProject } from "../controllers/projects.controller";

const router = Router();

router.get("/", getProjects);
router.put("/", updateProject);

export default router;
