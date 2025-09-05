const mongoose = require("mongoose");

const parentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  parentName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  alternatePhone: String,
  address: {
    type: String,
    required: true,
  },
  occupation: String,

  // Student Information
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

  // Teacher Preferences
  teacherGenderPreference: String,
  teacherExperiencePreference: String,
  teachingStylePreference: String,
  languagePreference: String,

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

  // Timestamps
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ParentForm", parentSchema);
