const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  studentAge: {
    type: Number,
    required: true,
  },
  studentGrade: {
    type: String,
    required: true,
  },
  currentSchool: {
    type: String,
    required: true,
  },
  studentGender: {
    type: String,
    required: true,
  },

  // Academic Requirements
  subjectsNeeded: {
    type: String,
    required: true,
  },
  currentAcademicLevel: {
    type: String,
    required: true,
  },
  specificChallenges: String,
  learningGoals: {
    type: String,
    required: true,
  },
  previousTutoringExperience: String,

  // Tuition Preferences
  preferredMode: {
    type: String,
    required: true,
  },
  preferredDays: {
    type: String,
    required: true,
  },
  preferredTime: {
    type: String,
    required: true,
  },
  sessionDuration: {
    type: String,
    required: true,
  },
  budgetRange: {
    type: String,
    required: true,
  },

  // Logistics
  homeAddress: String,
  willingToTravel: String,
  hasStudyRoom: {
    type: Boolean,
    default: false,
  },
  internetConnection: String,
  deviceAvailable: String,
  additionalRequirements: String,

  // Link back to Parent
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ParentForm",
    required: true,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Student", studentSchema);
