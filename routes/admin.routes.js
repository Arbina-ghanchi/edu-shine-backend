const express = require("express");
const router = express.Router();

const {
  getAllUser,
  getAllTeacher,
  getAllStudents,
  getTeacherByUserId,
  getAllParent,
} = require("../controllers/admin.controller");

router.get(
  "/all-users",
  (req, res, next) => {
    console.log("All parents route hit");
    next();
  },
  getAllUser
);

router.get("/all-teachers", getAllTeacher);
router.get("/all-students", getAllStudents);
router.get("/all-teacher/:id", getTeacherByUserId);
router.get("/all-parents", getAllParent);

module.exports = router;
