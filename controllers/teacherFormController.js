const teacherform = require("../models/teacherform");

// Create a new teacher form entry
exports.createTeacherForm = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log(userId, "chec user");
    const teacherFormData = {
      ...req.body,
      userId,
    };

    const teacherForm = await teacherform.findOneAndUpdate(
      { userId },
      teacherFormData,
      { new: true, upsert: true, runValidators: true }
    );

    res.status(201).json({
      success: true,
      message: "Teacher form submitted successfully",
      data: teacherForm,
    });
  } catch (error) {
    console.error("Error submitting teacher form:", error);
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
    const userId = req.user._id;
    const parentForm = await teacherform.findOne({ userId }).populate("userId");

    if (!parentForm) {
      return res.status(404).json({
        success: false,
        message: "No parent form found for this user",
      });
    }

    res.status(200).json({
      success: true,
      message: "Parent form fetched successfully",
      data: parentForm,
    });
  } catch (error) {
    console.error("Error fetching parent form:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching parent form",
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

// check teacher form by ID
exports.checkTeacherForm = async (req, res) => {
  try {
    const userId = req.user._id;
    const teacherForm = await teacherform?.findOne(userId);
    console.log(teacherForm, "parentForm");
    if (!teacherForm) {
      return res.status(404).json({
        success: false,
        message: "Parent form not found",
      });
    }
    res.status(200).json({
      success: true,
      data: teacherForm,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching parent form",
      error: error.message,
    });
  }
};
