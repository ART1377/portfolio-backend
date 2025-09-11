import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
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
import cloudinary from "./utils/cloudinary";

const app = express();
const PORT = process.env.PORT || 4000;

const allowedOrigins = [
  "http://localhost:3000", // local dev
  "https://alireza-tahavori.vercel.app", // production frontend
  "https://portfolio-frontend-git-main-art1377s-projects.vercel.app",
  "https://portfolio-frontend-707er2qg2-art1377s-projects.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // This is crucial!
  })
);

app.use(express.json());
app.use(cookieParser()); // Add cookie parser middleware

const uploadsDir = path.join(process.cwd(), "uploads");
app.use("/api/uploads", express.static(uploadsDir));

app.use("/api/hero", heroRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/experiences", experiencesRoutes);
app.use("/api/submissions", submissionsRoutes);

app.use("/api/image", uploadImageRoutes);

app.use("/api/contact-info", contactInfoRoutes);
app.use("/api/suggestions", suggestionsRoutes);

app.get("/api/cloudinary-test", async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(
      "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      { folder: "test", resource_type: "image" }
    );
    res.json({ success: true, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Cloudinary test failed:", message);
    res.status(500).json({ success: false, error: message });
  }
});

// Public login endpoint (no JWT)
app.use("/api/auth", adminRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
