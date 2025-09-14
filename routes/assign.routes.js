const express = require("express");
const router = express.Router();
const {
  createAssignment,
  getAssignedTeachers,
  getAssignmentsByTeacher,
  getAssignmentsByStudent,
  updateAssignmentStatus,
  getAssignmentFormData,
} = require("../controllers/teacherassign.controller");

router.route("/assignments").get(getAssignmentFormData).post(createAssignment);

router.get("/assignments/teachers", getAssignedTeachers);
router.get("/assignments/teacher/:teacherId", getAssignmentsByTeacher);
router.get("/assignments/student/:studentId", getAssignmentsByStudent);
router.patch("/assignments/:assignmentId/status", updateAssignmentStatus);

module.exports = router;
