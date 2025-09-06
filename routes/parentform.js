const express = require("express");
const router = express.Router();
const {
  createParentForm,
  getAllParentForms,
  getParentFormById,
  getMyAllForm,
  checkParentForm,
} = require("../controllers/parentFormController");
const authMiddleware = require("../utils/authMIddlware");

// Parent Form Routes
router.post("/", authMiddleware, createParentForm);
router.get("/my-form", authMiddleware, getMyAllForm);
router.get("/check-form-submit", authMiddleware, checkParentForm);

router.get("/", getAllParentForms);
router.get("/:id", getParentFormById);

module.exports = router;
