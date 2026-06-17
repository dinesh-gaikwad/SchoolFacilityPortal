const { getDB } = require('../config/database');

class Inventory {
  static async create(inventoryData) {
    const db = getDB();
    const { item_name, quantity, unit, min_quantity, status } = inventoryData;
    const query = `INSERT INTO inventory (item_name, quantity, unit, min_quantity, status, created_at) VALUES (?, ?, ?, ?, ?, NOW())`;
    const [result] = await db.execute(query, [item_name, quantity, unit, min_quantity, status || 'Good']);
    return result.insertId;
  }

  static async findById(id) {
    const db = getDB();
    const [items] = await db.execute('SELECT * FROM inventory WHERE id = ?', [id]);
    return items[0];
  }

  static async getAll() {
    const db = getDB();
    const [items] = await db.execute('SELECT * FROM inventory ORDER BY created_at DESC');
    return items;
  }

  static async update(id, inventoryData) {
    const db = getDB();
    const { item_name, quantity, unit, min_quantity, status } = inventoryData;
    const query = `UPDATE inventory SET item_name = ?, quantity = ?, unit = ?, min_quantity = ?, status = ? WHERE id = ?`;
    const [result] = await db.execute(query, [item_name, quantity, unit, min_quantity, status, id]);
    return result;
  }

  static async delete(id) {
    const db = getDB();
    const [result] = await db.execute('DELETE FROM inventory WHERE id = ?', [id]);
    return result;
  }

  static async getLowStock() {
    const db = getDB();
    const [items] = await db.execute('SELECT * FROM inventory WHERE quantity <= min_quantity');
    return items;
  }
}

module.exports = Inventory;
