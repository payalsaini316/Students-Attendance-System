
const mongoose = require("mongoose");

const periodSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
    trim: true
  },
  teacher: {
    type: String,
    default: ""
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  room: {
    type: String,
    default: ""
  },
  type: {
    type: String,
    enum: ["Class", "Break", "Activity"],
    default: "Class"
  }
});

const timetableSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      required: true,
      enum: [
        "1", "2", "3", "4", "5", "6",
        "7", "8", "9", "10", "11", "12"
      ]
    },
    section: {
      type: String,
      required: true,
      uppercase: true,
      trim: true
    },
    day: {
      type: String,
      required: true,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ]
    },
    periods: [periodSchema]
  },
  { timestamps: true }
);

// One timetable per class, section and day
timetableSchema.index(
  { className: 1, section: 1, day: 1 },
  { unique: true }
);

module.exports = mongoose.model("Timetable", timetableSchema);
