"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/testCloudinary.ts
const express_1 = require("express");
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const router = (0, express_1.Router)();
router.get("/cloudinary-test", async (req, res) => {
    try {
        const result = await cloudinary_1.default.uploader.upload("https://res.cloudinary.com/demo/image/upload/sample.jpg", { folder: "test" });
        res.json({ success: true, result });
    }
    catch (err) {
        console.error("Cloudinary test failed:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});
exports.default = router;
