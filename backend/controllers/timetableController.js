
const Timetable = require("../models/Timetable");

// GET: Fetch timetable by class, section and day
const getTimetable = async (req, res) => {
  try {
    let { className, section, day } = req.query;

    // Students can only view their own class timetable
    if (req.user.role === "student") {
      className = req.user.className;
      section = req.user.section;
    }

    if (!className || !section) {
      return res.status(400).json({
        success: false,
        message: "Class and section are required"
      });
    }

    const filter = {
      className: String(className),
      section: String(section).toUpperCase()
    };

    if (day) {
      filter.day = day;
    }

    const records = await Timetable.find(filter).sort({
      day: 1
    });

    res.status(200).json({
      success: true,
      records
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// POST: Add or replace a class-section-day timetable
const saveTimetable = async (req, res) => {
  try {
    const { className, section, day, periods } = req.body;

    if (!className || !section || !day || !Array.isArray(periods)) {
      return res.status(400).json({
        success: false,
        message: "Class, section, day and periods are required"
      });
    }

    const record = await Timetable.findOneAndUpdate(
      {
        className: String(className),
        section: String(section).toUpperCase(),
        day
      },
      {
        $set: {
          periods
        }
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true
      }
    );

    res.status(200).json({
      success: true,
      message: "Timetable saved successfully",
      record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// PUT: Edit an existing timetable
const updateTimetable = async (req, res) => {
  try {
    const { periods } = req.body;

    if (!Array.isArray(periods)) {
      return res.status(400).json({
        success: false,
        message: "Periods must be an array"
      });
    }

    const record = await Timetable.findByIdAndUpdate(
      req.params.id,
      { $set: { periods } },
      {
        new: true,
        runValidators: true
      }
    );

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Timetable not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Timetable updated successfully",
      record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE: Delete a timetable
const deleteTimetable = async (req, res) => {
  try {
    const record = await Timetable.findByIdAndDelete(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Timetable not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Timetable deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getTimetable,
  saveTimetable,
  updateTimetable,
  deleteTimetable
};
