const express = require("express");
const { login, signup } = require("../controllers/auth");
const router = express.Router();

// Add handler functions to your routes
router.post("/login", login);

router.get("/signup", signup);

module.exports = router;
