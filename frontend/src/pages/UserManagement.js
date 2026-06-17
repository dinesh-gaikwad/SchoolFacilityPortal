import React, { useState, useEffect } from 'react';
import { FaUsers, FaUserPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

function UserManagement() {
  const [user] = useState(() => localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null);
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', role: 'parent', email: 'john@example.com', schoolId: 'SCH001', status: 'Active', joinedDate: '2026-01-15' },
    { id: 2, name: 'Jane Smith', role: 'teacher', email: 'jane@example.com', schoolId: 'SCH001', status: 'Active', joinedDate: '2026-02-10' },
    { id: 3, name: 'Mike Johnson', role: 'parent', email: 'mike@example.com', schoolId: 'SCH001', status: 'Active', joinedDate: '2026-03-05' },
    { id: 4, name: 'Sarah Wilson', role: 'parent', email: 'sarah@example.com', schoolId: 'SCH001', status: 'Inactive', joinedDate: '2026-04-20' }
  ]);

  useEffect(() => {
    if (user?.role !== 'admin') window.location.href = '/dashboard';
  }, [user]);

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
      <div className="container">
        <div className="row mb-4">
          <div className="col-12">
            <h2 className="display-5"><FaUsers className="me-3" /> User Management</h2>
            <p className="text-muted">Manage all portal users</p>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-3 mb-3">
            <div className="stat-card">
              <h3>{users.length}</h3>
              <p>Total Users</p>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="stat-card">
              <h3>{users.filter(u => u.role === 'parent').length}</h3>
              <p>Parents</p>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="stat-card">
              <h3>{users.filter(u => u.role === 'teacher').length}</h3>
              <p>Teachers</p>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="stat-card">
              <h3>{users.filter(u => u.status === 'Active').length}</h3>
              <p>Active</p>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="card-custom">
              <div className="card-header">
                <h5 className="mb-0">All Users</h5>
              </div>
              <div className="card-body p-0">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Email</th>
                      <th>School ID</th>
                      <th>Status</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr>
                        <td><strong>{u.id}</strong></td>
                        <td>{u.name}</td>
                        <td><span className="badge bg-primary">{u.role}</span></td>
                        <td>{u.email}</td>
                        <td>{u.schoolId}</td>
                        <td><span className={`badge ${u.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>{u.status}</span></td>
                        <td>{u.joinedDate}</td>
                        <td>
                          <button className="btn btn-sm btn-primary"><FaEdit /></button>
                          <button className="btn btn-sm btn-danger ms-1"><FaTrash /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserManagement;
