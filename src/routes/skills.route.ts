import express from "express";
import { getSkills,updateSkills } from "../controllers/skills.controller";

const router = express.Router();

router.get("/", getSkills);
router.put("/", updateSkills); 

export default router;
