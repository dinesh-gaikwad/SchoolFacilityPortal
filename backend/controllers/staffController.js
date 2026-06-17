const Staff = require('../models/Staff');
const { adminAuth } = require('../middleware/auth');

// Create staff
exports.createStaff = async (req, res) => {
  try {
    const { name, role, phone, email, status } = req.body;
    const staffId = await Staff.create({ name, role, phone, email, status });
    
    res.status(201).json({
      message: 'Staff added successfully',
      staffId
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all staff
exports.getStaff = async (req, res) => {
  try {
    const staff = await Staff.getAll();
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get staff by ID
exports.getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update staff
exports.updateStaff = async (req, res) => {
  try {
    const { name, role, phone, email, status } = req.body;
    await Staff.update(req.params.id, { name, role, phone, email, status });
    
    res.json({ message: 'Staff updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete staff
exports.deleteStaff = async (req, res) => {
  try {
    await Staff.delete(req.params.id);
    res.json({ message: 'Staff deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
