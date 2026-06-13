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

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
  getFrontendUrl(),
  "http://localhost:5173",
  "http://localhost:4173",
].filter(Boolean);

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
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
