import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

import app from "./app.js";
import bootstrapAdminData from "./services/adminBootstrap.service.js";

const PORT = process.env.PORT || 5000;


// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected");

    await bootstrapAdminData();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
