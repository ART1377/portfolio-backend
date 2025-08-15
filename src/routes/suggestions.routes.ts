import express from "express";
import {
  getSuggestions,
  addSuggestion,
  // updateSuggestion,
  deleteSuggestion,
} from "../controllers/suggestions.controller";

const router = express.Router();

router.get("/", getSuggestions);
router.post("/", addSuggestion);
router.delete("/:id", deleteSuggestion);
// router.put("/:id", updateSuggestion);

export default router;
