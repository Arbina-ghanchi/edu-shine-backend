const express = require("express");
const router = express.Router();

const {
  getAllUser,
  getAllTeacher,
} = require("../controllers/admin.controller");

router.get("/all-users", getAllUser);

router.get("/all-teachers", getAllTeacher);

module.exports = router;
