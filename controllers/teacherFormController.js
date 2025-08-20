const teacherform = require("../models/teacherform");

// Create a new teacher form entry 
exports.createTeacherForm = async (req, res) => {
  try {
    const teacherForm = new teacherform(req.body);
    await teacherForm.save();
    res.status(201).json({
      success: true,
      message: "Teacher form submitted successfully",
      data: teacherForm,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error submitting teacher form",
      error: error.message,
    });
  }
};

// Get all teacher form entries
exports.getAllTeacherForms = async (req, res) => {
  try {
    const teacherForms = await teacherform.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: teacherForms.length,
      data: teacherForms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching teacher forms",
      error: error.message,
    });
  }
};

// Get single teacher form by ID
exports.getTeacherFormById = async (req, res) => {
  try {
    const teacherForm = await teacherform.findById(req.params.id);
    if (!teacherForm) {
      return res.status(404).json({
        success: false,
        message: "Teacher form not found",
      });
    }
    res.status(200).json({
      success: true,
      data: teacherForm,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching teacher form",
      error: error.message,
    });
  }
};

// Update teacher form by ID
exports.updateTeacherForm = async (req, res) => {
  try {
    const teacherForm = await teacherform.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!teacherForm) {
      return res.status(404).json({
        success: false,
        message: "Teacher form not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Teacher form updated successfully",
      data: teacherForm,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating teacher form",
      error: error.message,
    });
  }
};

// Delete teacher form by ID
exports.deleteTeacherForm = async (req, res) => {
  try {
    const teacherForm = await teacherform.findByIdAndDelete(req.params.id);
    if (!teacherForm) {
      return res.status(404).json({
        success: false,
        message: "Teacher form not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Teacher form deleted successfully",
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting teacher form",
      error: error.message,
    });
  }
};