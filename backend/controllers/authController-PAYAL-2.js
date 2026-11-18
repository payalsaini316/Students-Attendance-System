
const User = require("../models/User");
const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

// Register Student or Staff
exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      mobile,
      password,
      role,
      studentId,
      staffId,
      className,
      section,
      designation
    } = req.body;

    if (!name || !email || !mobile || !password || !role) {
      return res.status(400).json({
        message: "Please fill all required fields"
      });
    }

    if (!["student", "staff"].includes(role)) {
      return res.status(400).json({
        message: "Invalid registration role"
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must contain at least 8 characters"
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase()
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered"
      });
    }

    // Verify student against school records
    if (role === "student") {
      if (!studentId || !className || !section) {
        return res.status(400).json({
          message: "Student ID, class and section are required"
        });
      }

      const student = await Student.findOne({
        studentId,
        name: name.trim(),
        className,
        section
      });

      if (!student) {
        return res.status(404).json({
          message: "Student details do not match school records"
        });
      }
    }

    if (role === "staff" && (!staffId || !designation)) {
      return res.status(400).json({
        message: "Staff ID and designation are required"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      mobile,
      password: hashedPassword,
      role,
      studentId: role === "student" ? studentId : null,
      staffId: role === "staff" ? staffId : null,
      className: role === "student" ? className : null,
      section: role === "student" ? section : null,
      designation: role === "staff" ? designation : null,
      isApproved: role === "student"
    });

    res.status(201).json({
      success: true,
      message: role === "staff"
        ? "Registration submitted. Waiting for admin approval."
        : "Student account created successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Login Student or Staff

exports.login = async (req, res) => {
  try {
    const { identifier, password, role } = req.body;

    if (!identifier || !password || !role) {
      return res.status(400).json({
        message: "Please enter login details"
      });
    }

    const cleanIdentifier = identifier.trim();

    if (!["student", "staff", "admin"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role"
      });
    }

    let query;

    if (role === "student") {
      query = {
        studentId: cleanIdentifier,
        role: "student"
      };
    } else if (role === "staff") {
      query = {
        role: "staff",
        $or: [
          { staffId: cleanIdentifier },
          { email: cleanIdentifier.toLowerCase() }
        ]
      };
    } else {
      query = {
        email: cleanIdentifier.toLowerCase(),
        role: "admin"
      };
    }

    const user = await User.findOne(query);

    if (!user) {
      return res.status(401).json({
        message: "Account not found. Please check your login ID."
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Incorrect password. Please try again."
      });
    }

    if (role !== "admin" && !user.isApproved) {
      return res.status(403).json({
        message: "Your account is waiting for admin approval"
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        studentId: user.studentId,
        staffId: user.staffId,
        className: user.className,
        section: user.section,
        designation: user.designation
      }
    });

  } catch (error) {
    console.error("Login Error:", error.message);

    return res.status(500).json({
      message: "Server error during login"
    });
  }
};
