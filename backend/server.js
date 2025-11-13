import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import pool from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";

import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import ratingRoutes from "./routes/ratingRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import workerRoutes from "./routes/workerRoutes.js";

import mailer from "./utils/mailer.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/requests", serviceRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/workers", workerRoutes);
app.use(errorHandler);

// Root route
app.get("/", (req, res) => res.send("FixMate Backend Running"));

// Test DB Connection
const testDB = async () => {
  try {
    await pool.query("SELECT 1");
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection failed:", err.message);
  }
};
testDB();

// Test SMTP transporter (optional)
const testMailer = async () => {
  try {
    await mailer.transporter.verify();
    console.log("SMTP transporter ready");
  } catch (err) {
    console.warn("SMTP transporter verification failed:", err.message);
  }
};
testMailer();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
