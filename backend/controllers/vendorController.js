const Vendor = require('../models/Vendor');
const { adminAuth } = require('../middleware/auth');

// Create vendor
exports.createVendor = async (req, res) => {
  try {
    const { name, service, phone, email, address, status } = req.body;
    const vendorId = await Vendor.create({ name, service, phone, email, address, status });
    res.status(201).json({ message: 'Vendor created successfully', vendorId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all vendors
exports.getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.getAll();
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get vendor by ID
exports.getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update vendor
exports.updateVendor = async (req, res) => {
  try {
    const { name, service, phone, email, address, status } = req.body;
    await Vendor.update(req.params.id, { name, service, phone, email, address, status });
    res.json({ message: 'Vendor updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete vendor
exports.deleteVendor = async (req, res) => {
  try {
    await Vendor.delete(req.params.id);
    res.json({ message: 'Vendor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
