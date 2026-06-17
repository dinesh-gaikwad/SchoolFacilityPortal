const express = require('express');
const router = express.Router();
const { getSummaryReport, getIssuesByCategory, getIssuesByPriority, getMonthlyReport } = require('../controllers/reportController');
const { auth } = require('../middleware/auth');

router.get('/summary', auth, getSummaryReport);
router.get('/by-category', auth, getIssuesByCategory);
router.get('/by-priority', auth, getIssuesByPriority);
router.get('/monthly', auth, getMonthlyReport);

module.exports = router;
