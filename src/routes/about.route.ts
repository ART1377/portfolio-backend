import express from "express";
import { getAbout, updateAbout } from "../controllers/about.controller";
import { jwtAuth } from "../utils/jwtAuth";

const router = express.Router();

router.get("/", getAbout);
router.put("/", jwtAuth, updateAbout);

export default router;
