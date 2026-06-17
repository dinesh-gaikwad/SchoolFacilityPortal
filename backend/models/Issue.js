const { getDB } = require('../config/database');

class Issue {
  static async create(issueData) {
    const db = getDB();
    const { description, category, location, priority, reported_by, images } = issueData;

    const query = `
      INSERT INTO issues (description, category, location, priority, reported_by, status, created_at)
      VALUES (?, ?, ?, ?, ?, 'Pending', NOW())
    `;

    const [result] = await db.execute(query, [description, category, location, priority, reported_by]);
    return result.insertId;
  }

  static async findById(id) {
    const db = getDB();
    const [issues] = await db.execute('SELECT * FROM issues WHERE id = ?', [id]);
    return issues[0];
  }

  static async getByUser(userId) {
    const db = getDB();
    const [issues] = await db.execute('SELECT * FROM issues WHERE reported_by = ? ORDER BY created_at DESC', [userId]);
    return issues;
  }

  static async getAll(status = null) {
    const db = getDB();
    let query = 'SELECT * FROM issues';
    let params = [];

    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    const [issues] = await db.execute(query, params);
    return issues;
  }

  static async update(id, issueData) {
    const db = getDB();
    const { description, category, location, priority, status, assigned_to } = issueData;

    const query = `
      UPDATE issues 
      SET description = ?, category = ?, location = ?, priority = ?, status = ?, assigned_to = ?
      WHERE id = ?
    `;

    const [result] = await db.execute(query, [description, category, location, priority, status, assigned_to, id]);
    return result;
  }

  static async delete(id) {
    const db = getDB();
    const [result] = await db.execute('DELETE FROM issues WHERE id = ?', [id]);
    return result;
  }

  static async getStats() {
    const db = getDB();
    const [stats] = await db.execute(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'Pending' THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'In Progress' THEN 1 END) as in_progress,
        COUNT(CASE WHEN status = 'Resolved' THEN 1 END) as resolved
      FROM issues
    `);
    return stats[0];
  }
}

module.exports = Issue;
