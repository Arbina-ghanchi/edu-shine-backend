const parentform = require("../models/parentform");

// Create a new parent form entry
exports.createParentForm = async (req, res) => {
  console.log("is this hit ");
  try {
    const parentForm = new parentform(req.body);
    await parentForm.save();
    res.status(201).json({
      success: true,
      message: "Parent form submitted successfully",
      data: parentForm,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error submitting parent form",
      error: error.message,
    });
  }
};

// Get all parent form entries
exports.getAllParentForms = async (req, res) => {
  try {
    const parentForms = await parentform.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: parentForms.length,
      data: parentForms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching parent forms",
      error: error.message,
    });
  }
};

// Get single parent form by ID
exports.getParentFormById = async (req, res) => {
  try {
    const parentForm = await parentform.findById(req.params.id);
    if (!parentForm) {
      return res.status(404).json({
        success: false,
        message: "Parent form not found",
      });
    }
    res.status(200).json({
      success: true,
      data: parentForm,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching parent form",
      error: error.message,
    });
  }
};
