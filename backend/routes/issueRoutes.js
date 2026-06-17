const express = require('express');
const router = express.Router();
const { 
  createIssue, 
  getIssues, 
  getIssueById, 
  getIssuesByUser, 
  updateIssue, 
  deleteIssue,
  getIssueStats
} = require('../controllers/issueController');
const { auth, adminAuth } = require('../middleware/auth');

router.post('/', auth, createIssue);
router.get('/', auth, getIssues);
router.get('/stats', getIssueStats);
router.get('/user', auth, getIssuesByUser);
router.get('/:id', auth, getIssueById);
router.put('/:id', adminAuth, updateIssue);
router.delete('/:id', adminAuth, deleteIssue);

module.exports = router;
