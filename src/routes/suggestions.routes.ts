import express from "express";
import {
  getSuggestions,
  addSuggestion,
  // updateSuggestion,
  deleteSuggestion,
} from "../controllers/suggestions.controller";
import { jwtAuth } from "../utils/jwtAuth";

const router = express.Router();

router.get("/", getSuggestions);
router.post("/", jwtAuth, addSuggestion);
router.delete("/:id", jwtAuth, deleteSuggestion);
// router.put("/:id", updateSuggestion);

export default router;
