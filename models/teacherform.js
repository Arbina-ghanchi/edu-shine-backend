const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  alternatePhone: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female", "Other", "Prefer not to say"],
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },

  // Professional Information
  highestQualification: {
    type: String,
    required: true,
    trim: true,
  },
  currentProfession: {
    type: String,
    required: true,
    trim: true,
  },
  yearsOfExperience: {
    type: String,
    required: true,
    enum: [
      "Less than 1 year",
      "1-3 years",
      "3-5 years",
      "5-10 years",
      "10+ years",
    ],
  },
  teachingCertifications: {
    type: String,
    trim: true,
  },
  languagesSpoken: {
    type: String,
    required: true,
    trim: true,
  },

  // Subject Expertise
  primarySubjects: {
    type: String,
    required: true,
    trim: true,
  },
  secondarySubjects: {
    type: String,
    trim: true,
  },
  gradeLevelsTaught: {
    type: String,
    required: true,
    enum: [
      "Primary (1-5)",
      "Middle School (6-8)",
      "High School (9-10)",
      "Higher Secondary (11-12)",
      "College/University",
      "All Levels",
    ],
  },
  curriculumExpertise: {
    type: String,
    required: true,
    enum: ["CBSE", "ICSE", "State Board", "IGCSE", "IB", "Multiple"],
  },
  teachingMethodology: {
    type: String,
    trim: true,
  },

  // Availability
  teachingMode: {
    type: String,
    required: true,
    enum: ["Home Tuition", "Online Classes", "Both"],
  },
  availableDays: [
    {
      type: String,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
    },
  ],
  availableTimeSlots: {
    type: String,
    required: true,
    enum: [
      "Morning (6 AM - 12 PM)",
      "Afternoon (12 PM - 5 PM)",
      "Evening (5 PM - 9 PM)",
      "Flexible",
    ],
  },
  preferredSessionDuration: {
    type: String,
    required: true,
    enum: ["1 Hour", "1.5 Hours", "2 Hours"],
  },

  // Tuition Preferences
  minimumFee: {
    type: Number,
    required: true,
    min: [0, "Fee cannot be negative"],
  },
  preferredPaymentMethod: {
    type: String,
    required: true,
    enum: ["Cash", "Bank Transfer", "UPI", "Cheque"],
  },
  travelRadius: {
    type: String,
    enum: ["Up to 2 km", "Up to 5 km", "Up to 10 km", "Beyond 10 km"],
  },
  onlineTeachingTools: {
    type: String,
    trim: true,
  },

  // Additional Information
  bio: {
    type: String,
    required: true,
    trim: true,
  },
  teachingPhilosophy: {
    type: String,
    trim: true,
  },
  achievements: {
    type: String,
    trim: true,
  },
  references: {
    type: String,
    trim: true,
  },

  // Status and Timestamps
  applicationStatus: {
    type: String,
    enum: ["Pending", "Under Review", "Approved", "Rejected"],
    default: "Pending",
  },
  isActive: {
    type: Boolean,
    default: true,
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

// Create indexes for better query performance
teacherSchema.index({ email: 1 });
teacherSchema.index({ phone: 1 });
teacherSchema.index({ teachingMode: 1 });
teacherSchema.index({ primarySubjects: 1 });
teacherSchema.index({ availableDays: 1 });
teacherSchema.index({ applicationStatus: 1 });

// Pre-save middleware to update the updatedAt field
teacherSchema.pre("save", function (next) {
  if (this.isModified() && !this.isNew) {
    this.updatedAt = Date.now();
  }
  next();
});

module.exports = mongoose.model("TeacherForm", teacherSchema);
