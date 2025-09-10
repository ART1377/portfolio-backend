"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const hero_route_1 = __importDefault(require("./routes/hero.route"));
const about_route_1 = __importDefault(require("./routes/about.route"));
const skills_route_1 = __importDefault(require("./routes/skills.route"));
const projects_route_1 = __importDefault(require("./routes/projects.route"));
const experiences_route_1 = __importDefault(require("./routes/experiences.route"));
const submissions_route_1 = __importDefault(require("./routes/submissions.route"));
const image_route_1 = __importDefault(require("./routes/image.route"));
// admin
const contactInfo_route_1 = __importDefault(require("./routes/contactInfo.route"));
const suggestions_routes_1 = __importDefault(require("./routes/suggestions.routes"));
const admin_route_1 = __importDefault(require("./routes/admin.route"));
const cloudinary_1 = __importDefault(require("./utils/cloudinary"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
const allowedOrigins = [
    "http://localhost:3000", // local dev
    "https://portfolio-frontend-vert-gamma.vercel.app", // production frontend
    "https://portfolio-frontend-git-main-art1377s-projects.vercel.app",
    "https://portfolio-frontend-707er2qg2-art1377s-projects.vercel.app",
];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl requests)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true, // This is crucial!
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)()); // Add cookie parser middleware
const uploadsDir = path_1.default.join(process.cwd(), "uploads");
app.use("/api/uploads", express_1.default.static(uploadsDir));
app.use("/api/hero", hero_route_1.default);
app.use("/api/about", about_route_1.default);
app.use("/api/skills", skills_route_1.default);
app.use("/api/projects", projects_route_1.default);
app.use("/api/experiences", experiences_route_1.default);
app.use("/api/submissions", submissions_route_1.default);
app.use("/api/image", image_route_1.default);
app.use("/api/contact-info", contactInfo_route_1.default);
app.use("/api/suggestions", suggestions_routes_1.default);
app.get("/api/cloudinary-test", async (req, res) => {
    try {
        const result = await cloudinary_1.default.uploader.upload("https://res.cloudinary.com/demo/image/upload/sample.jpg", { folder: "test", resource_type: "image" });
        res.json({ success: true, result });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("Cloudinary test failed:", message);
        res.status(500).json({ success: false, error: message });
    }
});
// Public login endpoint (no JWT)
app.use("/api/auth", admin_route_1.default);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
