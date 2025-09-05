const parentform = require("../models/parentform");

// Create a new parent form entry
// In your parent form controller file
exports.createParentForm = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log(userId, "check if id is coming");
    const parentFormData = {
      ...req.body,
      user: userId,
    };

    const parentForm = new parentform(parentFormData);
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

//get my all form
exports.getMyAllForm = async (req, res) => {
  try {
    const parentForms = await parentform
      .find({ userId: req.params.id })
      .sort({ createdAt: -1 });
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
