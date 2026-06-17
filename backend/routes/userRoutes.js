const express = require('express');
const router = express.Router();
const { getAllUsers, updateProfile, updatePassword, deleteUser } = require('../controllers/userController');
const { auth, adminAuth } = require('../middleware/auth');

router.get('/', adminAuth, getAllUsers);
router.put('/profile', auth, updateProfile);
router.put('/password', auth, updatePassword);
router.delete('/:id', adminAuth, deleteUser);

module.exports = router;
