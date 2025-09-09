"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/hero.routes.ts
const express_1 = require("express");
const hero_controller_1 = require("../controllers/hero.controller");
const upload_1 = require("../middlewares/upload");
const resume_controller_1 = require("../controllers/resume.controller");
const jwtAuth_1 = require("../utils/jwtAuth");
const router = (0, express_1.Router)();
router.get("/", hero_controller_1.getHero);
router.put("/", jwtAuth_1.jwtAuth, hero_controller_1.updateHero);
// Resume upload (protected)
router.post("/upload-resume", upload_1.upload.single("resume"), resume_controller_1.uploadResume);
// Resume download (public)
router.get("/resume", resume_controller_1.downloadResume);
exports.default = router;
