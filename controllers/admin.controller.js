const user = require("../models/user");

exports.getAllUser = async (req, res) => {
  try {
    const users = await user.find();
    res.status(200).json({
      success: true,
      message: "All users retrieved successfully",
      data: {
        users,
      },
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getAllTeacher = async (req, res) => {
  try {
    const users = await user.find({ role: "teacher" });
    res.status(200).json({
      success: true,
      message: "All teacher forms retrieved successfully",
      data: {
        users,
      },
    });
  } catch (error) {
    console.error("Get all teacher forms error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
