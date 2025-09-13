const express = require("express");
const router = express.Router();
const {
  createTeacherForm,
  getAllTeacherForms,
  getTeacherFormById,
  updateTeacherForm,
  deleteTeacherForm,
  checkTeacherForm,
} = require("../controllers/teacherFormController");
const authMiddleware = require("../utils/authMIddlware");

// Teacher Form Routes
router.post("/", authMiddleware, createTeacherForm);
// router.get("/", authMiddleware, getAllTeacherForms);
router.get("/", authMiddleware, getTeacherFormById);
router.delete("/:id", deleteTeacherForm);

// check teacher form by ID
router.get("/check-teacher-form", authMiddleware, checkTeacherForm);

module.exports = router;
