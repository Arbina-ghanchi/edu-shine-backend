const parentform = require("../models/parentform");
const studentform = require("../models/studentform");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

exports.createParentForm = async (req, res) => {
  try {
    const userId = req.user._id;

    const parentFormData = {
      ...req.body,
      userId,
    };

    const parentForm = await parentform.findOneAndUpdate(
      { userId },
      parentFormData,
      { new: true, upsert: true, runValidators: true }
    );

    res.status(201).json({
      success: true,
      message: "Parent form submitted successfully",
      data: parentForm,
    });
  } catch (error) {
    console.error("Error submitting parent form:", error);
    res.status(400).json({
      success: false,
      message: "Error submitting parent form",
      error: error.message,
    });
  }
};
// parent dashboard with students
exports.getParentFormByUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const parentForm = await parentform.findOne({ userId }).populate("userId");

    if (!parentForm) {
      return res.status(404).json({
        success: false,
        message: "No parent form found for this user",
      });
    }

    res.status(200).json({
      success: true,
      message: "Parent form fetched successfully",
      data: parentForm,
    });
  } catch (error) {
    console.error("Error fetching parent form:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching parent form",
      error: error.message,
    });
  }
};

// setup nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL || "arbinaghanchi99@gmail.com",
    pass: process.env.APP_PASSWORD || "lxnbkekmggujrnov",
  },
});

// generate random password
function generateRandomPassword(length = 10) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!";
  let pass = "";
  for (let i = 0; i < length; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
}

// generate student email
function generateStudentEmail(fullName) {
  const nameParts = fullName.trim().toLowerCase().split(" ");
  const first = nameParts[0] || "student";
  const last = nameParts[1] || "user";
  const randomStr = Math.random().toString(36).substring(2, 6);
  return `${first}.${last}.${randomStr}@edushine.com`;
}

exports.createStudent = async (req, res) => {
  try {
    const userId = req.user._id;

    const userEmail = await User.findById(userId);
    console.log(userEmail.email, "check the email");

    const parent = await parentform.findOne({ userId });
    if (!parent) {
      return res.status(404).json({
        success: false,
        message:
          "Parent form not found. Please complete parent registration first.",
      });
    }

    // generate child email + password
    const childEmail = generateStudentEmail(req?.body?.studentName);
    const randomPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    // create child user in User schema
    const childUser = new User({
      fullName: req.body.studentName,
      email: childEmail,
      password: hashedPassword,
      role: "student",
    });
    await childUser.save();

    // create student entry in studentform
    const studentData = {
      ...req.body,
      email: childEmail,
      userId: childUser._id,
      parentId: parent._id,
    };

    const student = new studentform(studentData);
    await student.save();

    // push student into parent's "students" array
    parent.students.push(student._id);
    await parent.save();

    // send email to parent with child's credentials
    const mailOptions = {
      from: `"School System" <${
        process.env.GMAIL || "arbinaghanchi99@gmail.com"
      }>`,
      to: userEmail?.email,
      subject: "New Student Account Created - School Management System",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #4f46e5, #7c3aed);
              color: white;
              padding: 25px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background-color: #f9fafb;
              padding: 25px;
              border-radius: 0 0 8px 8px;
              border: 1px solid #e5e7eb;
              border-top: none;
            }
            .credentials {
              background-color: white;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            }
            .credential-item {
              margin-bottom: 15px;
              padding-bottom: 15px;
              border-bottom: 1px solid #f3f4f6;
            }
            .credential-item:last-child {
              border-bottom: none;
              margin-bottom: 0;
              padding-bottom: 0;
            }
            .label {
              font-weight: 600;
              color: #4b5563;
              display: block;
              margin-bottom: 5px;
            }
            .value {
              font-size: 16px;
              color: #111827;
              word-break: break-all;
            }
            .password {
              font-family: monospace;
              background-color: #fef3c7;
              padding: 8px 12px;
              border-radius: 4px;
              display: inline-block;
            }
            .footer {
              margin-top: 25px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              color: #6b7280;
              font-size: 14px;
            }
            .warning {
              background-color: #fffbeb;
              border-left: 4px solid #f59e0b;
              padding: 12px 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>New Student Account Created</h1>
          </div>
          
          <div class="content">
            <p>Dear ${userEmail?.fullName},</p>
            
            <p>We're pleased to inform you that a new student account has been successfully created under your parent account.</p>
            
            <div class="credentials">
              <h3 style="margin-top: 0; color: #4f46e5;">Student Credentials</h3>
              
              <div class="credential-item">
                <span class="label">Student Name</span>
                <span class="value">${req?.body?.studentName}</span>
              </div>
              
              <div class="credential-item">
                <span class="label">Login Email</span>
                <span class="value">${childEmail}</span>
              </div>
              
              <div class="credential-item">
                <span class="label">Password</span>
                <span class="value"><span class="password">${randomPassword}</span></span>
              </div>
            </div>
            
            <div class="warning">
              <strong>Important:</strong> Please provide these credentials to your child and instruct them to change their password after first login.
            </div>
            
            <p>Your child can now access the school portal using these credentials to view assignments, grades, and other important information.</p>
            
            <div class="footer">
              <p>Best regards,<br>
              <strong>School Management System Team</strong></p>
              
              <p style="font-size: 12px; margin-top: 20px; color: #9ca3af;">
                This is an automated message. Please do not reply to this email. 
                If you have any questions, please contact the school administration.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      success: true,
      message: "Student added successfully & credentials sent to parent email.",
      data: student,
    });
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(400).json({
      success: false,
      message: "Error creating student",
      error: error.message,
    });
  }
};

// @ parent can get all student account
exports.getStudentsByParent = async (req, res) => {
  try {
    const userId = req.user._id; // parent’s userId from auth
    const parent = await parentform.findOne({ userId });

    if (!parent) {
      return res.status(404).json({
        success: false,
        message:
          "Parent form not found. Please complete parent registration first.",
      });
    }

    // Fetch all students linked to this parent
    const students = await studentform.find({ parentId: parent._id });

    res.status(200).json({
      success: true,
      message: "Students fetched successfully",
      data: students,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching students",
      error: error.message,
    });
  }
};

exports.getMyAllForm = async (req, res) => {
  try {
    const userId = req.user._id;

    const parentForms = await parentform
      .find({ userId })
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: parentForms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching parent forms",
      error: error.message,
    });
  }
};

exports.getAllParentForms = async (req, res) => {
  try {
    const parentForms = await parentform.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: parentForms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching parent forms",
      error: error.message,
    });
  }
};

exports.checkParentForm = async (req, res) => {
  try {
    const userId = req.user._id;
    const parentForm = await parentform.findOne(userId);

    if (!parentForm) {
      return res.status(404).json({
        success: false,
        message: "Parent form not found",
      });
    }
    res.status(200).json({
      success: true,
      data: parentForm,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching parent form",
      error: error.message,
    });
  }
};

exports.getParentFormById = async (req, res) => {
  try {
    const parentForm = await parentform.findById(req.params.id);
    if (!parentForm) {
      return res.status(404).json({
        success: false,
        message: "Parent form not found",
      });
    }
    res.status(200).json({
      success: true,
      data: parentForm,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching parent form",
      error: error.message,
    });
  }
};
