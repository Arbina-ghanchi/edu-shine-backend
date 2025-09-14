const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TeacherForm",
    required: true,
  },
  studentId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentForm",
      required: true,
    },
  ],
  teacherAssigned: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  teachingMedium: {
    type: String,
    required: true,
    enum: ["Home Tuition", "Online Classes", "Both"],
    default: "Home Tuition",
  },
  Teaching_Batch: {
    type: String,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  // endDate: {
  //   type: Date,
  // },
  status: {
    type: String,
    enum: ["Active", "Completed", "Cancelled"],
    default: "Active",
  },
  notes: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
assignmentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Assignment", assignmentSchema);
