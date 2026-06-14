import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import session from "express-session";

import passport from "./config/passport.js";
import getFrontendUrl from "./utils/frontendUrl.js";

import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import studentRoutes from "./routes/student.routes.js";

const app = express();

app.set("trust proxy", 1);

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
  process.env.RENDER_EXTERNAL_URL,
  process.env.WEB_URL,
  getFrontendUrl(),
  "https://interviewverseai.onrender.com",
  "https://www.interviewverseai.onrender.com",
  "https://interview-verse-ai-ruby.vercel.app",
  "http://localhost:5173",
  "http://localhost:4173",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:4173",
].filter(Boolean);

const isOriginAllowed = (origin) => {
  if (!origin) {
    return true;
  }

  const normalizedOrigin = `${origin}`.replace(/\/+$/, "");
  if (allowedOrigins.includes(normalizedOrigin)) {
    return true;
  }

  try {
    const hostname = new URL(normalizedOrigin).hostname;
    return (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.endsWith(".onrender.com") ||
      hostname.endsWith(".vercel.app")
    );
  } catch {
    return false;
  }
};

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(helmet());

app.use(cookieParser());

app.use(
    session({
        secret: "keyboardcat",
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passport.initialize());

app.use(passport.session());


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/student", studentRoutes);


// Test Route
app.get("/", (req, res) => {
  res.send("InterviewVerse AI Backend Running");
});


export default app;
