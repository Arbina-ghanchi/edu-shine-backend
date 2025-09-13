const express = require("express");
const router = express.Router();

const {
  getAllUser,
  getAllTeacher,
  getTeacherByUserId,
} = require("../controllers/admin.controller");

router.get("/all-users", getAllUser);

router.get("/all-teachers", getAllTeacher);
router.get("/all-teacher/:id", getTeacherByUserId);

module.exports = router;
