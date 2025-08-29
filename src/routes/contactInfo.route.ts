import { Router } from "express";
import {
  getContactInfo,
  updateContactInfo,
} from "../controllers/contactInfo.controller";
import { jwtAuth } from "../utils/jwtAuth";

const router = Router();

router.get("/", getContactInfo);
router.put("/", jwtAuth, updateContactInfo);

export default router;
