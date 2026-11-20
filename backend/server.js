
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const studentRoutes = require("./routes/studentRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const timetableRoutes = require("./routes/timetableRoutes");
const noticeRoutes = require("./routes/noticeRoutes");

const app = express();

// Middleware
const allowedOrigins = [
  "http://localhost:5173",
  "https://students-attendance-system-beta.vercel.app",
  "https://students-attendance-system-5k7a1a4vi-payalsaini316s-projects.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Main route
app.get("/", (req, res) => {
  res.send("Student Attendance System API is running!");
});

// API Routes
app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/notices", noticeRoutes);

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
