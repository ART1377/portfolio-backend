"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contactInfo_controller_1 = require("../controllers/contactInfo.controller");
const jwtAuth_1 = require("../utils/jwtAuth");
const router = (0, express_1.Router)();
router.get("/", contactInfo_controller_1.getContactInfo);
router.put("/", jwtAuth_1.jwtAuth, contactInfo_controller_1.updateContactInfo);
exports.default = router;
