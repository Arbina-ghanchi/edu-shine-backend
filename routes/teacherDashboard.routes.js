const express = require("express");
const router = express.Router();

const {
  getTeacherAssignments,
  getSubjects,
  getAllTeacherClasses,
} = require("../controllers/teacherDashboard.controller");
const authMiddleware = require("../utils/authMIddlware");

router.route("/assign-teacher").get(authMiddleware, getTeacherAssignments);
router.route("/get-subjects").get(authMiddleware, getSubjects);
router.route("/get-teacher-classes").get(authMiddleware, getAllTeacherClasses);

module.exports = router;
