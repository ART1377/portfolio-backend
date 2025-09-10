"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtAuth = jwtAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function jwtAuth(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader?.startsWith("Bearer ")) {
        return res
            .status(401)
            .json({ errorCode: "NO_TOKEN", message: "Token required" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        next();
    }
    catch (err) {
        return res
            .status(403)
            .json({
            errorCode: "INVALID_TOKEN",
            message: "Token is invalid or expired",
        });
    }
}
