const express = require('express');
const router = express.Router();
const { createFacility, getFacilities, getFacilityById, updateFacility, deleteFacility, getFacilityStats } = require('../controllers/facilityController');
const { auth, adminAuth } = require('../middleware/auth');

router.post('/', adminAuth, createFacility);
router.get('/', auth, getFacilities);
router.get('/stats', auth, getFacilityStats);
router.get('/:id', auth, getFacilityById);
router.put('/:id', adminAuth, updateFacility);
router.delete('/:id', adminAuth, deleteFacility);

module.exports = router;
