const express = require("express");
const router = express.Router();
const {
  createStudentForm,
  getAllStudentForms,
  getStudentFormById,
} = require("../controllers/studentFormController");

// Student Form Routes
router.post("/", createStudentForm);
router.get("/", getAllStudentForms);
router.get("/:id", getStudentFormById);

module.exports = router; //take this and imp


