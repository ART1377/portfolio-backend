"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const experiences_controller_1 = require("../controllers/experiences.controller");
const jwtAuth_1 = require("../utils/jwtAuth");
const router = (0, express_1.Router)();
router.get("/", experiences_controller_1.getExperiences);
router.put("/", jwtAuth_1.jwtAuth, experiences_controller_1.updateExperiences);
exports.default = router;
