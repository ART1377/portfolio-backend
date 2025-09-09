"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const about_controller_1 = require("../controllers/about.controller");
const jwtAuth_1 = require("../utils/jwtAuth");
const router = express_1.default.Router();
router.get("/", about_controller_1.getAbout);
router.put("/", jwtAuth_1.jwtAuth, about_controller_1.updateAbout);
exports.default = router;
