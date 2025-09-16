const user = require("../models/user");
const assignmentModel = require("../models/assignmentModel");
const teacherform = require("../models/teacherform");

exports.getTeacherAssignments = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const subject = req.query.subjects;

    // Validate required fields
    if (!teacherId || !subject) {
      return res.status(400).json({
        success: false,
        message: "teacherId and subject parameters are required",
      });
    }

    // Check if teacher exists
    const teacher = await user.findById(teacherId);
    if (!teacher || teacher.role !== "teacher") {
      return res.status(404).json({
        success: false,
        message: "Teacher not found or user is not a teacher",
      });
    }

    // Find existing assignments for this teacher and subject with populated student details
    const existingAssignments = await assignmentModel
      .find({
        teacherId,
        subject,
      })
      .populate({
        path: "studentId",
        model: "User", // Make sure this matches your User model name
        select:
          "fullName email role grade profilePicture contactInfo createdAt", // Add the fields you want to retrieve
      })
      .sort({ createdAt: -1 });

    // Extract all unique assigned students with their full details
    const assignedStudents = [];
    const assignedStudentIds = new Set(); // Using Set to track unique IDs

    existingAssignments.forEach((assignment) => {
      if (assignment.studentId && Array.isArray(assignment.studentId)) {
        assignment.studentId.forEach((student) => {
          // Check if student is populated and not already added
          if (
            student &&
            student._id &&
            !assignedStudentIds.has(student._id.toString())
          ) {
            assignedStudentIds.add(student._id.toString());
            assignedStudents.push(student);
          }
        });
      }
    });

    // Prepare response data
    const formData = {
      teacherId,
      subject,
      students: assignedStudents, // Now contains full student objects with details
      assignedStudentCount: assignedStudents.length,
      assignments: existingAssignments, // Optional: include the full assignment data if needed
    };

    res.status(200).json({
      success: true,
      message: "Assignment form data retrieved successfully",
      data: formData,
    });
  } catch (error) {
    console.error("Error fetching teacher assignments:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getSubjects = async (req, res) => {
  try {
    const userId = req.user && req.user.id;

    const teacherForm = await teacherform.findOne({ userId });

    if (!teacherForm) {
      return res.status(404).json({
        success: false,
        message: "Teacher form not found",
      });
    }

    // build subject list
    const subjectsList = [
      teacherForm.primarySubject,
      teacherForm.secondarySubject,
    ].filter(Boolean);

    res.status(200).json({
      success: true,
      message: "Subjects retrieved successfully",
      data: subjectsList,
    });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getAllTeacherClasses = async (req, res) => {
  try {
    const teacherId = req.user.id;

    // Validate required fields
    if (!teacherId) {
      return res.status(400).json({
        success: false,
        message: "teacherId is required",
      });
    }

    // Check if teacher exists
    const teacher = await user.findById(teacherId);
    if (!teacher || teacher.role !== "teacher") {
      return res.status(404).json({
        success: false,
        message: "Teacher not found or user is not a teacher",
      });
    }

    // Find existing assignments for this teacher and subject with populated student details
    const existingAssignments = await assignmentModel
      .find({
        teacherId,
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Assignment form data retrieved successfully",
      data: existingAssignments,
    });
  } catch (error) {
    console.error("Error fetching teacher assignments:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
