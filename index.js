require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const parentformRoutes = require("./routes/parentform");
const app = express();

// Middleware
app.use(
  cors({
    origin: "*", // Or specify your frontend URL (e.g., "http://localhost:3000")
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Basic route
app.get("/", (req, res) => {
  res.send("EduShine Backend is running ✅");
});

//api routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/parentform", parentformRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
