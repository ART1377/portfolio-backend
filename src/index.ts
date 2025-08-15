import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import heroRoutes from "./routes/hero.route";
import aboutRoutes from "./routes/about.route";
import skillsRoutes from "./routes/skills.route";
import projectsRoutes from "./routes/projects.route";
import experiencesRoutes from "./routes/experiences.route";
import submissionsRoutes from "./routes/submissions.route";
import uploadImageRoutes from "./routes/image.route";

// admin
import contactInfoRoutes from "./routes/contactInfo.route";
import suggestionsRoutes from "./routes/suggestions.routes";
import fs from "fs";
import adminRoutes from "./routes/admin.route";
import { jwtAuth } from "./utils/jwtAuth";

const app = express();
const PORT = 4000;

app.use(cors({
  origin: "http://localhost:3000", // your Next.js frontend URL
  credentials: true, // <-- important for cookies
}));
app.use(express.json());

const uploadsDir = path.join(__dirname, "./uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));

app.use("/api/hero", heroRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/experiences", experiencesRoutes);
app.use("/api/submissions", submissionsRoutes);

app.use("/api/image", uploadImageRoutes);

app.use("/api/contact-info", contactInfoRoutes);
app.use("/api/suggestions", suggestionsRoutes);

// Public login endpoint (no JWT)
app.use("/api/auth", adminRoutes);

// Everything else under /api/admin is protected
app.use("/api/admin", jwtAuth);


// admin
// app.use("/api/admin", basicAuth);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
