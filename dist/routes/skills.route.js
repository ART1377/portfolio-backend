"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const skills_controller_1 = require("../controllers/skills.controller");
const jwtAuth_1 = require("../utils/jwtAuth");
const router = express_1.default.Router();
router.get("/", skills_controller_1.getSkills);
router.put("/", jwtAuth_1.jwtAuth, skills_controller_1.updateSkills);
exports.default = router;
