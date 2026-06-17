const Issue = require('../models/Issue');
const Facility = require('../models/Facility');

// Get summary report
exports.getSummaryReport = async (req, res) => {
  try {
    const issueStats = await Issue.getStats();
    const facilityStats = await Facility.getStats();
    
    res.json({
      issues: issueStats,
      facilities: facilityStats
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get issues by category
exports.getIssuesByCategory = async (req, res) => {
  try {
    const category = req.query.category;
    const db = Issue.getDB();
    const [issues] = await db.execute(
      'SELECT * FROM issues WHERE category = ? ORDER BY created_at DESC',
      [category]
    );
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get issues by priority
exports.getIssuesByPriority = async (req, res) => {
  try {
    const priority = req.query.priority;
    const db = Issue.getDB();
    const [issues] = await db.execute(
      'SELECT * FROM issues WHERE priority = ? ORDER BY created_at DESC',
      [priority]
    );
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get monthly report
exports.getMonthlyReport = async (req, res) => {
  try {
    const month = req.query.month; // Format: 2026-06
    const db = Issue.getDB();
    const [issues] = await db.execute(
      `SELECT * FROM issues WHERE YEAR(created_at) = YEAR(?) AND MONTH(created_at) = MONTH(?)`,
      [month]
    );
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
