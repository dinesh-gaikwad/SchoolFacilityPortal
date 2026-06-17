import React, { useState, useEffect } from 'react';
import { FaBell, FaCheckCircle, FaClock, FaExclamationCircle, FaTrash } from 'react-icons/fa';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const sampleNotifications = [
      { id: 1, message: 'Issue #3 has been resolved: Flickering light in Library', type: 'resolved', time: '2026-06-12 04:35 PM', read: false },
      { id: 2, message: 'Issue #2 status updated to In Progress: Leaking toilet', type: 'update', time: '2026-06-15 02:05 PM', read: false },
      { id: 3, message: 'New issue reported: Broken classroom chair', type: 'new', time: '2026-06-15 10:35 AM', read: true },
      { id: 4, message: 'Issue #4 is pending review', type: 'pending', time: '2026-06-16 09:00 AM', read: false }
    ];
    setNotifications(sampleNotifications);
  }, []);

  const getTypeIcon = (type) => {
    const icons = {
      'resolved': <FaCheckCircle style={{ color: '#198754' }} />,
      'update': <FaClock style={{ color: '#0d6efd' }} />,
      'new': <FaBell style={{ color: '#ffc107' }} />,
      'pending': <FaExclamationCircle style={{ color: '#ffc107' }} />
    };
    return icons[type] || <FaBell />;
  };

  const getTypeBadge = (type) => {
    const badges = { 'resolved': 'bg-success', 'update': 'bg-info', 'new': 'bg-warning', 'pending': 'bg-warning' };
    return badges[type] || 'bg-secondary';
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredNotifications = filter === 'All' ? notifications : notifications.filter(n => n.type === filter);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="py-5">
      <div className="container">
        <div className="row mb-4">
          <div className="col-12 d-flex justify-content-between align-items-center">
            <h2 className="display-5">
              <FaBell className="me-3" /> Notifications
              {unreadCount > 0 && <span className="badge bg-danger ms-2">{unreadCount} New</span>}
            </h2>
            <button className="btn btn-outline-primary" onClick={markAllAsRead}>Mark All as Read</button>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-12">
            <div className="btn-group">
              {['All', 'new', 'update', 'resolved', 'pending'].map((f) => (
                <button key={f} className={`btn ${filter === f ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setFilter(f)}>
                  {f === 'All' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="card-custom">
              <div className="card-body p-0">
                {filteredNotifications.length === 0 ? (
                  <div className="py-5 text-center">
                    <FaBell style={{ fontSize: '3rem', color: '#ccc' }} />
                    <p className="text-muted mt-3">No notifications found</p>
                  </div>
                ) : (
                  <div className="list-group list-group-flush">
                    {filteredNotifications.map((notification) => (
                      <div key={notification.id} className={`list-group-item d-flex align-items-center p-3 ${!notification.read ? 'bg-light' : ''}`} style={{ borderLeft: !notification.read ? '4px solid #667eea' : 'none' }}>
                        <div className="me-3">{getTypeIcon(notification.type)}</div>
                        <div className="flex-grow-1">
                          <p className={`mb-1 ${!notification.read ? 'font-weight-bold' : ''}`}>{notification.message}</p>
                          <small className="text-muted"><FaClock className="me-1" /> {notification.time}</small>
                        </div>
                        <div>
                          {!notification.read && <span className={`badge ${getTypeBadge(notification.type)} me-2`}>{notification.type}</span>}
                          <button className="btn btn-sm btn-outline-secondary" onClick={() => markAsRead(notification.id)}><FaCheckCircle /></button>
                          <button className="btn btn-sm btn-outline-danger ms-1" onClick={() => deleteNotification(notification.id)}><FaTrash /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notifications;
