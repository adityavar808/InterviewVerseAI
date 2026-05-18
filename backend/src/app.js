import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";

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


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);


// Test Route
app.get("/", (req, res) => {
  res.send("InterviewVerse AI Backend Running");
});


export default app;