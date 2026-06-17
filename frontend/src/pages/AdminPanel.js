import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { issuesAPI, staffAPI, facilitiesAPI } from '../services/api';
import { FaChartLine, FaUsers, FaBuilding, FaExclamationTriangle } from 'react-icons/fa';

function AdminPanel() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ total: 0, pending: 0, in_progress: 0, resolved: 0 });
  const [staffCount, setStaffCount] = useState(0);
  const [facilityCount, setFacilityCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      loadAdminData();
    }
  }, []);

  const loadAdminData = async () => {
    try {
      const statsRes = await issuesAPI.getStats();
      const staffRes = await staffAPI.getAll();
      const facilityRes = await facilitiesAPI.getAll();

      setStats(statsRes.data);
      setStaffCount(staffRes.data.length);
      setFacilityCount(facilityRes.data.length);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="py-5 text-center">
        <div className="alert alert-warning">Admin access required</div>
        <button onClick={() => window.location.href = '/login'} className="btn btn-custom">Go to Login</button>
      </div>
    );
  }

  return (
    <div className="py-5">
      <div className="container-fluid">
        <div className="row mb-4">
          <div className="col-12">
            <h2 className="display-5"><FaChartLine className="me-3" /> Admin Dashboard</h2>
            <p className="text-muted">Manage school facilities and issues</p>
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

        <div className="row mb-4">
          <div className="col-md-6 mb-3">
            <div className="stat-card">
              <FaUsers className="mb-2" style={{ fontSize: '2rem', color: '#667eea' }} />
              <h3>{staffCount}</h3>
              <p>Staff Members</p>
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="stat-card">
              <FaBuilding className="mb-2" style={{ fontSize: '2rem', color: '#764ba2' }} />
              <h3>{facilityCount}</h3>
              <p>Facilities</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="row">
          <div className="col-12">
            <div className="card-custom">
              <div className="card-header">
                <h5 className="mb-0"><FaExclamationTriangle className="me-2" /> Quick Actions</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3 mb-2">
                    <Link to="/reports" className="btn btn-outline-primary w-100">📊 Reports</Link>
                  </div>
                  <div className="col-md-3 mb-2">
                    <Link to="/staff-management" className="btn btn-outline-primary w-100">👥 Staff</Link>
                  </div>
                  <div className="col-md-3 mb-2">
                    <Link to="/facility-list" className="btn btn-outline-primary w-100">🏢 Facilities</Link>
                  </div>
                  <div className="col-md-3 mb-2">
                    <Link to="/user-management" className="btn btn-outline-primary w-100">👪 Users</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
