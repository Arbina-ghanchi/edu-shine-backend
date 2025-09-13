const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  subjectName: {
    type: String,
    required: true,
  },
  subjectCode: {
    type: String,
  },
  subjectDescription: {
    type: String,
  },
  subjectTeacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  subjectStudents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
  subjectParents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parent",
    },
  ],
  subjectTeachers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
  ],
  subjectCreatedAt: {
    type: Date,
    default: Date.now,
  },
  subjectUpdatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Subject", subjectSchema);
