const express = require('express');
const router = express.Router();
const { createInventory, getInventory, getLowStock, updateInventory, deleteInventory } = require('../controllers/inventoryController');
const { adminAuth } = require('../middleware/auth');

router.post('/', adminAuth, createInventory);
router.get('/', adminAuth, getInventory);
router.get('/low-stock', adminAuth, getLowStock);
router.put('/:id', adminAuth, updateInventory);
router.delete('/:id', adminAuth, deleteInventory);

module.exports = router;
