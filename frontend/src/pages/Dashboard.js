import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { issuesAPI, notificationsAPI } from '../services/api';
import { FaExclamationTriangle, FaCheckCircle, FaClock, FaBell } from 'react-icons/fa';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ total: 0, pending: 0, in_progress: 0, resolved: 0 });
  const [issues, setIssues] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      loadDashboardData();
    }
  }, []);

  const loadDashboardData = async () => {
    try {
      const statsRes = await issuesAPI.getStats();
      const issuesRes = await issuesAPI.getByUser();
      const notifRes = await notificationsAPI.getAll();
      const unreadRes = await notificationsAPI.getUnreadCount();

      setStats(statsRes.data);
      setIssues(issuesRes.data.slice(0, 5));
      setNotifications(notifRes.data.slice(0, 5));
      setUnreadCount(unreadRes.data.count);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="py-5 text-center">
        <div className="alert alert-warning">Please login to view dashboard</div>
        <button onClick={() => window.location.href = '/login'} className="btn btn-custom">Go to Login</button>
      </div>
    );
  }

  return (
    <div className="py-5">
      <div className="container">
        <div className="row mb-4">
          <div className="col-12 d-flex justify-content-between align-items-center">
            <h2 className="display-5">👋 Welcome, {user.name}</h2>
            <div className="d-flex gap-2">
              <Link to="/report-issue" className="btn btn-custom">
                <FaExclamationTriangle className="me-2" /> Report Issue
              </Link>
              <Link to="/track-issues" className="btn btn-outline-primary">
                Track Issues
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="row mb-4">
          <div className="col-md-3 mb-3">
            <div className="stat-card">
              <h3>{stats.total}</h3>
              <p>Total Issues</p>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="stat-card">
              <h3 className="text-warning">{stats.pending}</h3>
              <p>Pending</p>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="stat-card">
              <h3 className="text-info">{stats.in_progress}</h3>
              <p>In Progress</p>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="stat-card">
              <h3 className="text-success">{stats.resolved}</h3>
              <p>Resolved</p>
            </div>
          </div>
        </div>

        {/* My Issues */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card-custom">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0"><FaClock className="me-2" /> My Recent Issues</h5>
                <Link to="/track-issues" className="btn btn-sm btn-outline-primary">View All</Link>
              </div>
              <div className="card-body p-0">
                {loading ? (
                  <div className="text-center p-4">Loading...</div>
                ) : issues.length === 0 ? (
                  <div className="text-center p-4">No issues reported yet</div>
                ) : (
                  <table className="table table-hover">
                    <thead>
                      <tr><th>ID</th><th>Category</th><th>Location</th><th>Priority</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {issues.map((issue) => (
                        <tr>
                          <td><strong>{issue.id}</strong></td>
                          <td>{issue.category}</td>
                          <td>{issue.location}</td>
                          <td><span className={`badge bg-${issue.priority === 'Critical' ? 'danger' : issue.priority === 'High' ? 'warning' : 'info'}`}>{issue.priority}</span></td>
                          <td><span className={`badge bg-${issue.status === 'Resolved' ? 'success' : issue.status === 'In Progress' ? 'info' : 'warning'}`}>{issue.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="row">
          <div className="col-12">
            <div className="card-custom">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0"><FaBell className="me-2" /> Notifications {unreadCount > 0 && <span className="badge bg-danger">{unreadCount}</span>}</h5>
                <button className="btn btn-sm btn-outline-primary" onClick={() => notificationsAPI.markAllAsRead()}>Mark All Read</button>
              </div>
              <div className="card-body p-0">
                {notifications.length === 0 ? (
                  <div className="text-center p-4">No notifications</div>
                ) : (
                  <div className="list-group list-group-flush">
                    {notifications.map((notif) => (
                      <div className="list-group-item d-flex justify-content-between align-items-center">
                        <span>{notif.message}</span>
                        <small className="text-muted">{new Date(notif.created_at).toLocaleDateString()}</small>
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

export default Dashboard;
