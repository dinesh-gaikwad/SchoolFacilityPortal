const { getDB } = require('../config/database');

class Notification {
  static async create(notificationData) {
    const db = getDB();
    const { user_id, message, issue_id } = notificationData;
    const query = `INSERT INTO notifications (user_id, message, issue_id, is_read, created_at) VALUES (?, ?, ?, FALSE, NOW())`;
    const [result] = await db.execute(query, [user_id, message, issue_id]);
    return result.insertId;
  }

  static async getByUser(userId) {
    const db = getDB();
    const [notifications] = await db.execute('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20', [userId]);
    return notifications;
  }

  static async markAsRead(id) {
    const db = getDB();
    const [result] = await db.execute('UPDATE notifications SET is_read = TRUE WHERE id = ?', [id]);
    return result;
  }

  static async markAllAsRead(userId) {
    const db = getDB();
    const [result] = await db.execute('UPDATE notifications SET is_read = TRUE WHERE user_id = ?', [userId]);
    return result;
  }

  static async delete(id) {
    const db = getDB();
    const [result] = await db.execute('DELETE FROM notifications WHERE id = ?', [id]);
    return result;
  }

  static async getUnreadCount(userId) {
    const db = getDB();
    const [count] = await db.execute('SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE', [userId]);
    return count[0].count;
  }
}

module.exports = Notification;
