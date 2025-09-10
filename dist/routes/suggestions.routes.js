"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const suggestions_controller_1 = require("../controllers/suggestions.controller");
const jwtAuth_1 = require("../utils/jwtAuth");
const router = express_1.default.Router();
router.get("/", suggestions_controller_1.getSuggestions);
router.post("/", jwtAuth_1.jwtAuth, suggestions_controller_1.addSuggestion);
router.delete("/:id", jwtAuth_1.jwtAuth, suggestions_controller_1.deleteSuggestion);
// router.put("/:id", updateSuggestion);
exports.default = router;
