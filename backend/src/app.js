import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import session from "express-session";

import passport from "./config/passport.js";

import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import studentRoutes from "./routes/student.routes.js";

const app = express();


// Middleware
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
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