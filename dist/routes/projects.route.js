"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const projects_controller_1 = require("../controllers/projects.controller");
const jwtAuth_1 = require("../utils/jwtAuth");
const router = (0, express_1.Router)();
router.get("/", projects_controller_1.getProjects);
router.put("/", jwtAuth_1.jwtAuth, projects_controller_1.updateProject);
exports.default = router;
