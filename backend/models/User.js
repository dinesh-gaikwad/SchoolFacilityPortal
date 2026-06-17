const { getDB } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    const db = getDB();
    const { name, email, password, phone, schoolId, role, address } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `INSERT INTO users (name, email, password, phone, school_id, role, address, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`;
    const [result] = await db.execute(query, [name, email, hashedPassword, phone, schoolId, role || 'parent', address]);
    return result.insertId;
  }

  static async findByEmail(email) {
    const db = getDB();
    const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return users[0];
  }

  static async findById(id) {
    const db = getDB();
    const [users] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
    return users[0];
  }

  static async update(id, userData) {
    const db = getDB();
    const { name, email, phone, address } = userData;
    const query = `UPDATE users SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?`;
    const [result] = await db.execute(query, [name, email, phone, address, id]);
    return result;
  }

  static async getAll() {
    const db = getDB();
    const [users] = await db.execute('SELECT * FROM users ORDER BY created_at DESC');
    return users;
  }

  static async delete(id) {
    const db = getDB();
    const [result] = await db.execute('DELETE FROM users WHERE id = ?', [id]);
    return result;
  }

  static async updatePassword(id, newPassword) {
    const db = getDB();
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const query = `UPDATE users SET password = ? WHERE id = ?`;
    const [result] = await db.execute(query, [hashedPassword, id]);
    return result;
  }
}

module.exports = User;
