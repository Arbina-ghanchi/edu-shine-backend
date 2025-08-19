const express = require("express");
const router = express.Router();
const {
  createParentForm,
  getAllParentForms,
  getParentFormById,
} = require("../controllers/parentFormController");

// Parent Form Routes
router.post("/", createParentForm);
router.get("/", getAllParentForms);
router.get("/:id", getParentFormById);

module.exports = router;
