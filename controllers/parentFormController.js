const parentform = require("../models/parentform");

exports.createParentForm = async (req, res) => {
  try {
    const userId = req.user._id;

    const parentFormData = {
      ...req.body,
      userId,
    };

    const parentForm = await parentform.findOneAndUpdate(
      { userId },
      parentFormData,
      { new: true, upsert: true, runValidators: true }
    );

    res.status(201).json({
      success: true,
      message: "Parent form submitted successfully",
      data: parentForm,
    });
  } catch (error) {
    console.error("Error submitting parent form:", error);
    res.status(400).json({
      success: false,
      message: "Error submitting parent form",
      error: error.message,
    });
  }
};

exports.getMyAllForm = async (req, res) => {
  try {
    const userId = req.user._id;

    const parentForms = await parentform
      .find({ userId })
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
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

exports.getAllParentForms = async (req, res) => {
  try {
    const parentForms = await parentform.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
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

exports.checkParentForm = async (req, res) => {
  try {
    const userId = req.user._id;
    const parentForm = await parentform.findOne(userId);

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
