const express = require("express");
const { signup, signin } = require("../controllers/auth");
const router = express.Router();

// Add handler functions to your routes
router.post("/signup", signup);
router.post("/login", signin);

module.exports = router;
