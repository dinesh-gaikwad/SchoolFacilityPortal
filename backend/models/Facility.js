const { getDB } = require('../config/database');

class Facility {
  static async create(facilityData) {
    const db = getDB();
    const { name, type, location, capacity, status } = facilityData;
    const query = `INSERT INTO facilities (name, type, location, capacity, status, created_at) VALUES (?, ?, ?, ?, ?, NOW())`;
    const [result] = await db.execute(query, [name, type, location, capacity, status || 'Active']);
    return result.insertId;
  }

  static async findById(id) {
    const db = getDB();
    const [facilities] = await db.execute('SELECT * FROM facilities WHERE id = ?', [id]);
    return facilities[0];
  }

  static async getAll() {
    const db = getDB();
    const [facilities] = await db.execute('SELECT * FROM facilities ORDER BY created_at DESC');
    return facilities;
  }

  static async getByType(type) {
    const db = getDB();
    const [facilities] = await db.execute('SELECT * FROM facilities WHERE type = ?', [type]);
    return facilities;
  }

  static async update(id, facilityData) {
    const db = getDB();
    const { name, type, location, capacity, status } = facilityData;
    const query = `UPDATE facilities SET name = ?, type = ?, location = ?, capacity = ?, status = ? WHERE id = ?`;
    const [result] = await db.execute(query, [name, type, location, capacity, status, id]);
    return result;
  }

  static async delete(id) {
    const db = getDB();
    const [result] = await db.execute('DELETE FROM facilities WHERE id = ?', [id]);
    return result;
  }

  static async getStats() {
    const db = getDB();
    const [stats] = await db.execute(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'Active' THEN 1 END) as active,
        COUNT(CASE WHEN status = 'Maintenance' THEN 1 END) as maintenance,
        COUNT(CASE WHEN status = 'Inactive' THEN 1 END) as inactive
      FROM facilities
    `);
    return stats[0];
  }
}

module.exports = Facility;
