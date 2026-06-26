const Issue = require("../models/Issue");
const Notification = require("../models/Notification");

const generateIssueId = () => `ISS-${Date.now()}`;

const createIssue = async (req, res) => {
  try {
    const { category, description, location, priority, images } = req.body;

    const issue = await Issue.create({
      issueId: generateIssueId(),
      userId: req.user.id,
      category,
      description,
      location,
      priority,
      images: images || [],
      timeline: [{ action: "Issue reported" }]
    });

    await Notification.create({
      userId: req.user.id,
      issueId: issue.id,
      message: `Your issue ${issue.issueId} has been submitted successfully.`
    });

    res.status(201).json(issue);
  } catch (error) {
    res.status(500).json({ message: "Failed to create issue", error: error.message });
  }
};

const getMyIssues = async (req, res) => {
  try {
    const issues = await Issue.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch issues", error: error.message });
  }
};

const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });
    res.json(issue);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch issue", error: error.message });
  }
};

const updateIssueStatus = async (req, res) => {
  try {
    const { status, assignedTo, estimatedResolution, action } = req.body;
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    if (status) issue.status = status;
    if (assignedTo) issue.assignedTo = assignedTo;
    if (estimatedResolution) issue.estimatedResolution = estimatedResolution;
    if (action) issue.timeline.push({ action });

    await issue.save();

    await Notification.create({
      userId: issue.userId,
      issueId: issue.id,
      message: `Issue ${issue.issueId} status updated to ${issue.status}.`
    });

    res.json(issue);
  } catch (error) {
    res.status(500).json({ message: "Failed to update issue", error: error.message });
  }
};

const getAllIssues = async (req, res) => {
  try {
    const issues = await Issue.find().populate("userId", "name email role schoolId").sort({ createdAt: -1 });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch issues", error: error.message });
  }
};

module.exports = { createIssue, getMyIssues, getIssueById, updateIssueStatus, getAllIssues };
