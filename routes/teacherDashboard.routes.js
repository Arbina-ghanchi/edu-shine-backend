const express = require("express");
const router = express.Router();

const {
  getTeacherAssignments,
  getSubjects,
} = require("../controllers/teacherDashboard.controller");
const authMiddleware = require("../utils/authMIddlware");

router.route("/assign-teacher").get(authMiddleware, getTeacherAssignments);
router.route("/get-subjects").get(authMiddleware, getSubjects);

module.exports = router;
