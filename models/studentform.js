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
    trim: true,
  },
  fatherName: {
    type: String,
    required: true,
    trim: true,
  },
  fatherMobile: {
    type: String,
    required: true,
    trim: true,
  },
  motherName: {
    type: String,
    required: true,
    trim: true,
  },
  motherMobile: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  fatherOccupation: {
    type: String,
    required: true,
    trim: true,
  },
  motherOccupation: {
    type: String,
    required: true,
    trim: true,
  },
  siblings: {
    type: String,
    trim: true,
  },
  requirements: {
    type: String,
    trim: true,
  },
  admissionFor: {
    type: String,
    required: true,
    trim: true,
  },
  schoolBoard: {
    type: String,
    required: true,
    trim: true,
  },
  subjects: {
    type: String,
    required: true,
    trim: true,
  },
  lectureDuration: {
    type: String,
    required: true,
    trim: true,
  },
  preferredDays: {
    type: String,
    required: true,
    trim: true,
  },
  preferredTime: {
    type: String,
    required: true,
    trim: true,
  },
  numberOfDays: {
    type: String,
    required: true,
    trim: true,
  },
  strongestSubject: {
    type: String,
    trim: true,
  },
  weakestSubject: {
    type: String,
    trim: true,
  },
  specialRemarks: {
    type: String,
    trim: true,
  },
  lastYearPercentage: {
    type: String,
    trim: true,
  },
  referenceFrom: {
    type: String,
    trim: true,
  },
  preferableTeacher: {
    type: String,
    trim: true,
  },
  joinSpokenEnglish: {
    type: Boolean,
    default: false,
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

module.exports = mongoose.model("StudentForm", studentSchema);
