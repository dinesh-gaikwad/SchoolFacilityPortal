const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { createIssue, getMyIssues, getIssueById, updateIssueStatus, getAllIssues } = require("../controllers/issueController");

router.post("/", protect, createIssue);
router.get("/my", protect, getMyIssues);
router.get("/", protect, adminOnly, getAllIssues);
router.get("/:id", protect, getIssueById);
router.put("/:id", protect, adminOnly, updateIssueStatus);

module.exports = router;
