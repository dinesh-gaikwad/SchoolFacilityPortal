const Issue = require('../models/Issue');
const { auth } = require('../middleware/auth');

// Create issue
exports.createIssue = async (req, res) => {
  try {
    const { description, category, location, priority } = req.body;
    const reported_by = req.user.id;

    const issueId = await Issue.create({ description, category, location, priority, reported_by });
    
    res.status(201).json({
      message: 'Issue reported successfully',
      issueId
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all issues
exports.getIssues = async (req, res) => {
  try {
    const status = req.query.status;
    const issues = await Issue.getAll(status);
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get issue by ID
exports.getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }
    res.json(issue);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get issues by user
exports.getIssuesByUser = async (req, res) => {
  try {
    const issues = await Issue.getByUser(req.user.id);
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update issue (Admin only)
exports.updateIssue = async (req, res) => {
  try {
    const { description, category, location, priority, status, assigned_to } = req.body;
    await Issue.update(req.params.id, { description, category, location, priority, status, assigned_to });
    
    res.json({ message: 'Issue updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete issue
exports.deleteIssue = async (req, res) => {
  try {
    await Issue.delete(req.params.id);
    res.json({ message: 'Issue deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get issue stats
exports.getIssueStats = async (req, res) => {
  try {
    const stats = await Issue.getStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
