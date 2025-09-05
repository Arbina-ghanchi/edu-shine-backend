const express = require("express");
const router = express.Router();
const {
  createParentForm,
  getAllParentForms,
  getParentFormById,
  getMyAllForm,
} = require("../controllers/parentFormController");
const authMiddleware = require("../utils/authMIddlware");

// Parent Form Routes
router.post("/", authMiddleware, createParentForm);
router.get("/my-all-form/:id", getMyAllForm);

router.get("/", getAllParentForms);
router.get("/:id", getParentFormById);

module.exports = router;
