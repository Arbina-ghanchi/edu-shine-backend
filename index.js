require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// logger imports
const logger = require("./utils/logger");
const loggingMiddleware = require("./utils/loggerMiddleware");

// users imports
const authRoutes = require("./routes/auth");
const parentformRoutes = require("./routes/parentform");

//admin imports
const adminRoutes = require("./routes/admin.routes");

const app = express();

// Middleware
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

// Add logging middleware
app.use(loggingMiddleware);

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => logger.info("Connected to MongoDB"))
  .catch((err) => logger.error("MongoDB connection error:", err));

// Basic route
app.get("/", (req, res) => {
  logger.info("Root endpoint accessed");
  res.send("EduShine Backend is running ✅");
});

// API routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/parentform", parentformRoutes);

//admin routes
app.use("/api/v1/admin", adminRoutes);

// 404 handler where is frontend
app.use((req, res) => {
  logger.warn("Route not found", {
    method: req.method,
    url: req.url,
    ip: req.ip,
  });

  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  logger.error("Unhandled error", {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
  });

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  logger.info(`Server running on port http://localhost:${PORT}`);
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception", error);
  process.exit(1);
});

// Handle unhandled rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection", {
    reason: reason.message || reason,
    promise,
  });
  process.exit(1);
});
