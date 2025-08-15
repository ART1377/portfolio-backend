import express from "express";
import { getAbout, updateAbout } from "../controllers/about.controller";

const router = express.Router();

router.get("/", getAbout);
router.put("/", updateAbout); 

export default router;
