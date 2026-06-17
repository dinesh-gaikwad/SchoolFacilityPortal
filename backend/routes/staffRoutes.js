const express = require('express');
const router = express.Router();
const { 
  createStaff, 
  getStaff, 
  getStaffById, 
  updateStaff, 
  deleteStaff 
} = require('../controllers/staffController');
const { adminAuth } = require('../middleware/auth');

router.post('/', adminAuth, createStaff);
router.get('/', adminAuth, getStaff);
router.get('/:id', adminAuth, getStaffById);
router.put('/:id', adminAuth, updateStaff);
router.delete('/:id', adminAuth, deleteStaff);

module.exports = router;
