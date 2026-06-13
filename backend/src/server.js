import dns from "dns";
import dotenv from "dotenv";
dotenv.config();

dns.setServers(["8.8.8.8", "8.8.4.4"]);

import mongoose from "mongoose";

import app from "./app.js";
import bootstrapAdminData from "./services/adminBootstrap.service.js";

const PORT = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error("Missing MONGO_URI in backend/.env. Add your MongoDB connection string and restart.");
  process.exit(1);
}

// MongoDB Connection
mongoose
  .connect(mongoUri)
  .then(async () => {
    console.log("MongoDB Connected");

    await bootstrapAdminData();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message || error);
    if (error.code === "ECONNREFUSED") {
      console.error("SRV lookup failed. Check your DNS resolver or use a non-srv MongoDB URI.");
    }
    process.exit(1);
  });
