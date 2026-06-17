const { getDB } = require('../config/database');

class Staff {
  static async create(staffData) {
    const db = getDB();
    const { name, role, phone, email, status } = staffData;

    const query = `
      INSERT INTO staff (name, role, phone, email, status, created_at)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;

    const [result] = await db.execute(query, [name, role, phone, email, status || 'Active']);
    return result.insertId;
  }

  static async findById(id) {
    const db = getDB();
    const [staff] = await db.execute('SELECT * FROM staff WHERE id = ?', [id]);
    return staff[0];
  }

  static async getAll() {
    const db = getDB();
    const [staff] = await db.execute('SELECT * FROM staff ORDER BY created_at DESC');
    return staff;
  }

  static async update(id, staffData) {
    const db = getDB();
    const { name, role, phone, email, status } = staffData;

    const query = `
      UPDATE staff 
      SET name = ?, role = ?, phone = ?, email = ?, status = ?
      WHERE id = ?
    `;

    const [result] = await db.execute(query, [name, role, phone, email, status, id]);
    return result;
  }

  static async delete(id) {
    const db = getDB();
    const [result] = await db.execute('DELETE FROM staff WHERE id = ?', [id]);
    return result;
  }
}

module.exports = Staff;
