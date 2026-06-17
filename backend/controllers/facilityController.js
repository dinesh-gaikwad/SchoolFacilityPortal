const Facility = require('../models/Facility');
const { adminAuth } = require('../middleware/auth');

// Create facility
exports.createFacility = async (req, res) => {
  try {
    const { name, type, location, capacity, status } = req.body;
    const facilityId = await Facility.create({ name, type, location, capacity, status });
    res.status(201).json({ message: 'Facility created successfully', facilityId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all facilities
exports.getFacilities = async (req, res) => {
  try {
    const facilities = await Facility.getAll();
    res.json(facilities);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get facility by ID
exports.getFacilityById = async (req, res) => {
  try {
    const facility = await Facility.findById(req.params.id);
    if (!facility) return res.status(404).json({ message: 'Facility not found' });
    res.json(facility);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update facility
exports.updateFacility = async (req, res) => {
  try {
    const { name, type, location, capacity, status } = req.body;
    await Facility.update(req.params.id, { name, type, location, capacity, status });
    res.json({ message: 'Facility updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete facility
exports.deleteFacility = async (req, res) => {
  try {
    await Facility.delete(req.params.id);
    res.json({ message: 'Facility deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get facility stats
exports.getFacilityStats = async (req, res) => {
  try {
    const stats = await Facility.getStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
