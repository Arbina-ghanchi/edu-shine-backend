require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");

//controller data 
const parentformRoutes = require("./routes/parentform");
const teacherformRoutes = require("./routes/teacherform");
const studentformRoutes = require("./routes/studentform");


const app = express();
 
// Middleware
app.use(
  cors({
    origin: "*",
  })
); // <-- add this
app.use(express.urlencoded({ extended: true }));
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
 
app.get("/test", (req, res) => {
  res.json({ message: "Test successful" });
});
 
//api routes yeaha par sare route integration 
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/parentform", parentformRoutes);
app.use("/api/v1/teacherform", teacherformRoutes);
app.use("/api/v1/studentform", studentformRoutes);
 
// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
 