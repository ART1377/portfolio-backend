import { Router } from "express";
import { getProjects, updateProject } from "../controllers/projects.controller";
import { jwtAuth } from "../utils/jwtAuth";

const router = Router();

router.get("/", getProjects);
router.put("/", jwtAuth, updateProject);

export default router;
