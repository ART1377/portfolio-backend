"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const image_controller_1 = require("../controllers/image.controller");
const upload_1 = require("../middlewares/upload"); // multer disk storage
const router = express_1.default.Router();
router.post("/upload", upload_1.upload.single("image"), image_controller_1.uploadImage);
router.post("/delete", image_controller_1.deleteImage);
exports.default = router;
