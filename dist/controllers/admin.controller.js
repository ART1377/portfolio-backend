"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutController = exports.loginController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
const JWT_SECRET = process.env.JWT_SECRET;
if (!ADMIN_USERNAME || !ADMIN_PASSWORD_HASH || !JWT_SECRET) {
    console.error("Missing required environment variables for authentication");
    process.exit(1);
}
const loginController = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res
            .status(400)
            .json({
            errorCode: "MISSING_CREDENTIALS",
            message: "Username and password are required",
        });
    }
    if (username !== ADMIN_USERNAME) {
        return res
            .status(401)
            .json({
            errorCode: "INVALID_CREDENTIALS",
            message: "Invalid username or password",
        });
    }
    try {
        const passwordMatch = await bcrypt_1.default.compare(password, ADMIN_PASSWORD_HASH);
        if (!passwordMatch) {
            return res
                .status(401)
                .json({
                errorCode: "INVALID_CREDENTIALS",
                message: "Invalid username or password",
            });
        }
        const token = jsonwebtoken_1.default.sign({ username }, JWT_SECRET, { expiresIn: "1h" });
        // return token in response body
        return res.json({ success: true, token, message: "Login successful" });
    }
    catch (error) {
        console.error("Login error:", error);
        return res
            .status(500)
            .json({
            errorCode: "INTERNAL_ERROR",
            message: "An internal server error occurred",
        });
    }
};
exports.loginController = loginController;
const logoutController = (req, res) => {
    try {
        res.cookie("token", "", {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 0,
            path: "/",
        });
        return res.json({
            success: true,
            message: "Logout successful",
        });
    }
    catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({
            errorCode: "INTERNAL_ERROR",
            message: "An internal server error occurred",
        });
    }
};
exports.logoutController = logoutController;
