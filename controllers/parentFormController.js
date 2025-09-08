const parentform = require("../models/parentform");
const studentform = require("../models/studentform");

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
// parent dashboard with students
exports.getParentFormByUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const parentForm = await parentform.findOne({ userId }).populate("userId");

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

// @ parent can create student account
exports.createStudent = async (req, res) => {
  try {
    const userId = req.user._id; // student will also be a user
    const parent = await parentform.findOne({ userId: req.user._id });
    console.log(userId, parent, "check studnet and parent ");
    if (!parent) {
      return res.status(404).json({
        success: false,
        message:
          "Parent form not found. Please complete parent registration first.",
      });
    }

    const studentData = {
      ...req.body,
      userId, // logged-in user (if student has own account)
      parentId: parent._id, // link to parent
    };

    const student = new studentform(studentData);
    await student.save();
    console.log(student);
    // push student into parent's "students" array
    parent.students.push(student._id);
    await parent.save();

    res.status(201).json({
      success: true,
      message: "Student added successfully",
      data: student,
    });
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(400).json({
      success: false,
      message: "Error creating student",
      error: error.message,
    });
  }
};

// @ parent can get all student account
exports.getStudentsByParent = async (req, res) => {
  try {
    const userId = req.user._id; // parent’s userId from auth
    const parent = await parentform.findOne({ userId });

    if (!parent) {
      return res.status(404).json({
        success: false,
        message:
          "Parent form not found. Please complete parent registration first.",
      });
    }

    // Fetch all students linked to this parent
    const students = await studentform.find({ parentId: parent._id });

    res.status(200).json({
      success: true,
      message: "Students fetched successfully",
      data: students,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching students",
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
