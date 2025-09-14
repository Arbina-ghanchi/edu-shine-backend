const assignmentModel = require("../models/assignmentModel");
const user = require("../models/user");

// Create a new assignment
exports.createAssignment = async (req, res) => {
  try {
    const {
      teacherId,
      studentIds, // Array of student IDs
      teacherAssigned,
      childAssigned,
      subject,
      teachingMedium,
      endDate,
      status,
      notes,
    } = req.body;

    // Validate required fields
    if (
      !teacherId ||
      !studentIds ||
      !teacherAssigned ||
      !childAssigned ||
      !subject
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: teacherId, studentIds, teacherAssigned, childAssigned, subject",
      });
    }

    // Check if teacher exists and has teacher role
    const teacher = await user.findById(teacherId);
    if (!teacher || teacher.role !== "teacher") {
      return res.status(404).json({
        success: false,
        message: "Teacher not found or user is not a teacher",
      });
    }

    // Check if all students exist and have student role
    const students = await user.find({ _id: { $in: studentIds } });
    if (students.length !== studentIds.length) {
      return res.status(404).json({
        success: false,
        message: "One or more students not found",
      });
    }

    const invalidStudents = students.filter(
      (student) => student.role !== "student"
    );
    if (invalidStudents.length > 0) {
      return res.status(400).json({
        success: false,
        message: "One or more users are not students",
      });
    }

    // Check if teacherAssigned user exists
    const assignedTeacher = await user.findById(teacherAssigned);
    if (!assignedTeacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher assigned user not found",
      });
    }

    // Check if childAssigned user exists
    const assignedChild = await user.findById(childAssigned);
    if (!assignedChild) {
      return res.status(404).json({
        success: false,
        message: "Child assigned user not found",
      });
    }

    // Create new assignment
    const assignment = new assignmentModel({
      teacherId,
      studentId: studentIds,
      teacherAssigned,
      childAssigned,
      subject,
      teachingMedium: teachingMedium || "Offline",
      endDate,
      status: status || "Active",
      notes,
    });

    const savedAssignment = await assignment.save();

    res.status(201).json({
      success: true,
      message: "assignmentModel created successfully",
      data: {
        assignment: savedAssignment,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get all teachers who are assigned to students
exports.getAssignedTeachers = async (req, res) => {
  try {
    // Find all assignments and populate teacher details
    const assignments = await assignmentModel
      .find()
      .populate({
        path: "teacherId",
        select: "fullName email role description",
        match: { role: "teacher" },
      })
      .populate({
        path: "studentId",
        select: "fullName email",
        match: { role: "student" },
      });

    // Filter out assignments where teacher is null (if any)
    const validAssignments = assignments.filter(
      (assignment) => assignment.teacherId !== null
    );

    // Get unique teachers with their assigned students
    const teacherMap = new Map();

    validAssignments.forEach((assignment) => {
      const teacherId = assignment.teacherId._id.toString();

      if (!teacherMap.has(teacherId)) {
        teacherMap.set(teacherId, {
          teacher: assignment.teacherId,
          assignedStudents: [],
          assignments: [],
        });
      }

      const teacherData = teacherMap.get(teacherId);

      // Add students from this assignment
      assignment.studentId.forEach((student) => {
        if (
          student &&
          !teacherData.assignedStudents.some(
            (s) => s._id.toString() === student._id.toString()
          )
        ) {
          teacherData.assignedStudents.push(student);
        }
      });

      // Add assignment details
      teacherData.assignments.push({
        assignmentId: assignment._id,
        subject: assignment.subject,
        teachingMedium: assignment.teachingMedium,
        status: assignment.status,
        startDate: assignment.startDate,
        endDate: assignment.endDate,
      });
    });

    const assignedTeachers = Array.from(teacherMap.values());

    res.status(200).json({
      success: true,
      message: "Assigned teachers retrieved successfully",
      data: {
        assignedTeachers,
        totalAssignedTeachers: assignedTeachers.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get assignments by teacher ID
exports.getAssignmentsByTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;

    const assignments = await assignmentModel
      .find({ teacherId })
      .populate({
        path: "studentId",
        select: "fullName email",
      })
      .populate({
        path: "teacherAssigned",
        select: "fullName email",
      })
      .populate({
        path: "childAssigned",
        select: "fullName email",
      });

    res.status(200).json({
      success: true,
      message: "Teacher assignments retrieved successfully",
      data: {
        assignments,
        totalAssignments: assignments.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get assignments by student ID
exports.getAssignmentsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const assignments = await assignmentModel
      .find({ studentId: studentId })
      .populate({
        path: "teacherId",
        select: "fullName email description",
      })
      .populate({
        path: "teacherAssigned",
        select: "fullName email",
      })
      .populate({
        path: "childAssigned",
        select: "fullName email",
      });

    res.status(200).json({
      success: true,
      message: "Student assignments retrieved successfully",
      data: {
        assignments,
        totalAssignments: assignments.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update assignment status
exports.updateAssignmentStatus = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { status } = req.body;

    if (!["Active", "Completed", "Cancelled"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be one of: Active, Completed, Cancelled",
      });
    }

    const assignment = await assignmentModel.findByIdAndUpdate(
      assignmentId,
      { status, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "assignmentModel not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "assignmentModel status updated successfully",
      data: {
        assignment,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
