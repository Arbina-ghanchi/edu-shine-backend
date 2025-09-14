const user = require("../models/user");
const teacherform = require("../models/teacherform");
const { default: mongoose } = require("mongoose");
const studentform = require("../models/studentform");

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

    const teacherForms = await teacherform.find({ userId: { $in: users } });
    res.status(200).json({
      success: true,
      message: "All teacher forms retrieved successfully",
      data: {
        users,
        teacherForms,
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

//get teacher detaial bu user id
exports.getTeacherByUserId = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if userId is provided
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Validate the userId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    // Use the imported User model
    const userData = await user.findById(id);

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find the teacher form by userId and populate all user details
    const teacherForm = await teacherform?.findOne({ userId: id }).populate({
      path: "userId",
      select: "-password", // Exclude password field for security
    });
    if (!teacherForm) {
      return res.status(404).json({
        success: false,
        message: "Teacher form not found for this user",
      });
    }

    // Structure the response to include both user details and teacher form details
    const teacherDetails = {
      userDetails: {
        _id: teacherForm.userId._id,
        fullName: teacherForm.userId.fullName,
        email: teacherForm.userId.email,
        role: teacherForm.userId.role,
        profilePicture: teacherForm.userId.profilePicture,
        isActive: teacherForm.userId.isActive,
        createdAt: teacherForm.userId.createdAt,
        updatedAt: teacherForm.userId.updatedAt,
      },
      teacherFormDetails: {
        // Personal Information
        fullName: teacherForm.fullName,
        phone: teacherForm.phone,
        address: teacherForm.address,
        gender: teacherForm.gender,
        dateOfBirth: teacherForm.dateOfBirth,

        // Professional Information
        highestQualification: teacherForm.highestQualification,
        currentProfession: teacherForm.currentProfession,
        yearsOfExperience: teacherForm.yearsOfExperience,
        teachingCertifications: teacherForm.teachingCertifications,
        languagesSpoken: teacherForm.languagesSpoken,

        // Subject Expertise
        primarySubjects: teacherForm.primarySubject,
        secondarySubjects: teacherForm.secondarySubject,
        gradeLevelsTaught: teacherForm.gradeLevelsTaught,
        curriculumExpertise: teacherForm.curriculumExpertise,
        teachingMethodology: teacherForm.teachingMethodology,

        // Availability
        teachingMode: teacherForm.teachingMode,
        availableDays: teacherForm.availableDays,
        availableTimeSlots: teacherForm.availableTimeSlots,
        preferredSessionDuration: teacherForm.preferredSessionDuration,

        // Tuition Preferences
        minimumFee: teacherForm.minimumFee,
        preferredPaymentMethod: teacherForm.preferredPaymentMethod,
        travelRadius: teacherForm.travelRadius,
        onlineTeachingTools: teacherForm.onlineTeachingTools,

        // Additional Information
        bio: teacherForm.bio,
        teachingPhilosophy: teacherForm.teachingPhilosophy,
        achievements: teacherForm.achievements,

        // Status and Metadata
        applicationStatus: teacherForm.applicationStatus,
        isActive: teacherForm.isActive,
        createdAt: teacherForm.createdAt,
        updatedAt: teacherForm.updatedAt,
        _id: teacherForm._id,
      },
    };

    res.status(200).json({
      success: true,
      message: "Teacher details retrieved successfully",
      data: teacherDetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// get all students
exports.getAllStudents = async (req, res) => {
  try {
    const users = await user.find({ role: "student" });
    const studentForms = await studentform.find({ userId: { $in: users } });
    res.status(200).json({
      success: true,
      message: "All students retrieved successfully",
      data: {
        users,
        studentForms,
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
// get all parents
exports.getAllParent = async (req, res) => {
  try {
    const users = await user?.find({ role: "parent" });

    res.status(200).json({
      success: true,
      message: "All teacher forms retrieved successfully",
      data: {
        users,
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
