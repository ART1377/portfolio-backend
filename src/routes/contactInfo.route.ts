import { Router } from "express";
import {
  getContactInfo,
  updateContactInfo,
} from "../controllers/contactInfo.controller";

const router = Router();

router.get("/", getContactInfo);
router.put("/", updateContactInfo);

export default router;
