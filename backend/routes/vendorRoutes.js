const express = require('express');
const router = express.Router();
const { createVendor, getVendors, getVendorById, updateVendor, deleteVendor } = require('../controllers/vendorController');
const { adminAuth } = require('../middleware/auth');

router.post('/', adminAuth, createVendor);
router.get('/', adminAuth, getVendors);
router.get('/:id', adminAuth, getVendorById);
router.put('/:id', adminAuth, updateVendor);
router.delete('/:id', adminAuth, deleteVendor);

module.exports = router;
