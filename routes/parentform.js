const express = require("express");
const router = express.Router();
const {
  createParentForm,
  getAllParentForms,
  getParentFormById,
  getMyAllForm,
  checkParentForm,
  getParentFormByUser,
  createStudent,
  getStudentsByParent,
} = require("../controllers/parentFormController");
const authMiddleware = require("../utils/authMIddlware");

router
  .route("/")
  .post(authMiddleware, createParentForm)
  .get(authMiddleware, getParentFormByUser);

// ! This can be crated by parent
router
  .route("/student")
  .post(authMiddleware, createStudent)
  .get(authMiddleware, getStudentsByParent);

router.get("/my-form", authMiddleware, getMyAllForm);
router.get("/check-form-submit", authMiddleware, checkParentForm);

router.get("/", getAllParentForms);
router.get("/:id", getParentFormById);

module.exports = router;
