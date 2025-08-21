const express = require("express");
const {
  signup,
  signin,
  getProfile,
  updateProfile,
  getAllUser,
  deleteAccount,
} = require("../controllers/auth");
const authMiddleware = require("../utils/authMIddlware");
const router = express.Router();

// Add handler functions to your routes
router.post("/signup", signup);
router.post("/login", signin);

//admin user routes
router.post("/all-user", getAllUser);

router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.delete("/delete", authMiddleware, deleteAccount);

module.exports = router;
