import express from "express";
import { loginController,logoutController } from "../controllers/admin.controller";

const router = express.Router();

router.post("/login", loginController);

router.post("/logout", logoutController);

export default router;
