const Inventory = require('../models/Inventory');
const { adminAuth } = require('../middleware/auth');

// Create inventory item
exports.createInventory = async (req, res) => {
  try {
    const { item_name, quantity, unit, min_quantity, status } = req.body;
    const itemId = await Inventory.create({ item_name, quantity, unit, min_quantity, status });
    res.status(201).json({ message: 'Inventory item created successfully', itemId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all inventory
exports.getInventory = async (req, res) => {
  try {
    const items = await Inventory.getAll();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get low stock items
exports.getLowStock = async (req, res) => {
  try {
    const items = await Inventory.getLowStock();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update inventory
exports.updateInventory = async (req, res) => {
  try {
    const { item_name, quantity, unit, min_quantity, status } = req.body;
    await Inventory.update(req.params.id, { item_name, quantity, unit, min_quantity, status });
    res.json({ message: 'Inventory updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete inventory
exports.deleteInventory = async (req, res) => {
  try {
    await Inventory.delete(req.params.id);
    res.json({ message: 'Inventory item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
