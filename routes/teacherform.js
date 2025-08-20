const express = require("express");
const router = express.Router();
const {
  createTeacherForm,
  getAllTeacherForms,
  getTeacherFormById,
  updateTeacherForm,
  deleteTeacherForm,
} = require("../controllers/teacherFormController");

// Teacher Form Routes
router.post("/", createTeacherForm);
router.get("/", getAllTeacherForms);
router.get("/:id", getTeacherFormById);
router.put("/:id", updateTeacherForm);
router.delete("/:id", deleteTeacherForm);

module.exports = router;