const { getDB } = require('../config/database');

class Vendor {
  static async create(vendorData) {
    const db = getDB();
    const { name, service, phone, email, address, status } = vendorData;
    const query = `INSERT INTO vendors (name, service, phone, email, address, status, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())`;
    const [result] = await db.execute(query, [name, service, phone, email, address, status || 'Active']);
    return result.insertId;
  }

  static async findById(id) {
    const db = getDB();
    const [vendors] = await db.execute('SELECT * FROM vendors WHERE id = ?', [id]);
    return vendors[0];
  }

  static async getAll() {
    const db = getDB();
    const [vendors] = await db.execute('SELECT * FROM vendors ORDER BY created_at DESC');
    return vendors;
  }

  static async getByService(service) {
    const db = getDB();
    const [vendors] = await db.execute('SELECT * FROM vendors WHERE service = ?', [service]);
    return vendors;
  }

  static async update(id, vendorData) {
    const db = getDB();
    const { name, service, phone, email, address, status } = vendorData;
    const query = `UPDATE vendors SET name = ?, service = ?, phone = ?, email = ?, address = ?, status = ? WHERE id = ?`;
    const [result] = await db.execute(query, [name, service, phone, email, address, status, id]);
    return result;
  }

  static async delete(id) {
    const db = getDB();
    const [result] = await db.execute('DELETE FROM vendors WHERE id = ?', [id]);
    return result;
  }
}

module.exports = Vendor;
