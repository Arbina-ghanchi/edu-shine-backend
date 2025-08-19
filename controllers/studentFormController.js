const studentform = require("../models/studentform");

// Create a new student form entry
exports.createStudentForm = async (req, res) => {
  try {
    const studentForm = new studentform(req.body);
    await studentForm.save();
    res.status(201).json({
      success: true,
      message: "Student form submitted successfully",
      data: studentForm,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error submitting student form",
      error: error.message,
    });
  }
};

// Get all student form entries
exports.getAllStudentForms = async (req, res) => {
  try {
    const studentForms = await studentform.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: studentForms.length,
      data: studentForms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching student forms",
      error: error.message,
    });
  }
};

// Get single student form by ID
exports.getStudentFormById = async (req, res) => {
  try {
    const studentForm = await studentform.findById(req.params.id);
    if (!studentForm) {
      return res.status(404).json({
        success: false,
        message: "Student form not found",
      });
    }
    res.status(200).json({
      success: true,
      data: studentForm,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching student form",
      error: error.message,
    });
  }
};