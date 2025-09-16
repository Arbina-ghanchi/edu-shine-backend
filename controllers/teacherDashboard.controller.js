const user = require("../models/user");
const assignmentModel = require("../models/assignmentModel");
const teacherform = require("../models/teacherform");

exports.getTeacherAssignments = async (req, res) => {
  try {
    // Get teacherId from authenticated user
    const teacherId = req.user && req.user.id;
    const subjects = req.params.subjects;

    if (!teacherId) {
      return res.status(400).json({
        success: false,
        message: "User ID missing from request",
      });
    }

    // Check if the user is a teacher
    const teacher = await user?.findById(teacherId);
    if (!teacher || teacher.role !== "teacher") {
      return res.status(404).json({
        success: false,
        message: "Teacher not found or user is not a teacher",
      });
    }

    // Fetch all assignments for this teacher
    const assignments = await assignmentModel
      .find({ teacherId, subject: subjects })
      .populate("studentId", "fullName email") // populate student details
      .populate("teacherId", "fullName email"); // populate teacher details

    if (!assignments || assignments.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No assignments found for this teacher",
        data: [],
      });
    }

    // Prepare a clean response
    const formattedAssignments = assignments.map((assignment) => ({
      assignmentId: assignment._id,
      teacher: assignment.teacherId,
      subject: assignment.subject,
      teachingMedium: assignment.teachingMedium,
      status: assignment.status,
      notes: assignment.notes,
      students: assignment.studentId, // populated student data
      createdAt: assignment.createdAt,
    }));

    res.status(200).json({
      success: true,
      message: "Assignments retrieved successfully",
      data: formattedAssignments,
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
