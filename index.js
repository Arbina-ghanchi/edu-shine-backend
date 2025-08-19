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
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://localhost:5173",
    ], // Add your frontend URLs
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
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
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
