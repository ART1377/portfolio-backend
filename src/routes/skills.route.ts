import express from "express";
import { getSkills, updateSkills } from "../controllers/skills.controller";
import { jwtAuth } from "../utils/jwtAuth";

const router = express.Router();

router.get("/", getSkills);
router.put("/", jwtAuth, updateSkills);

export default router;
