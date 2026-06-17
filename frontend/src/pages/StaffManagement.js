import React, { useState, useEffect } from 'react';
import { FaUserShield, FaUserPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

function StaffManagement() {
  const [user] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  
  const [staff, setStaff] = useState([
    { id: 1, name: 'Rajesh Kumar', role: 'Electrician', phone: '9876543210', email: 'rajesh@example.com', status: 'Active', assignedTasks: 5 },
    { id: 2, name: 'Suresh Patel', role: 'Plumber', phone: '9876543211', email: 'suresh@example.com', status: 'Active', assignedTasks: 3 },
    { id: 3, name: 'Vikram Singh', role: 'General Maintenance', phone: '9876543212', email: 'vikram@example.com', status: 'Active', assignedTasks: 7 },
    { id: 4, name: 'Amit Sharma', role: 'Carpenter', phone: '9876543213', email: 'amit@example.com', status: 'Inactive', assignedTasks: 0 }
  ]);

  useEffect(() => {
    if (user?.role !== 'admin') {
      window.location.href = '/dashboard';
    }
  }, [user]);

  const [newStaff, setNewStaff] = useState({ name: '', role: '', phone: '', email: '', status: 'Active' });
  const [showModal, setShowModal] = useState(false);

  const handleAddStaff = () => {
    const newId = staff.length + 1;
    setStaff([...staff, { ...newStaff, id: newId, assignedTasks: 0 }]);
    setNewStaff({ name: '', role: '', phone: '', email: '', status: 'Active' });
    setShowModal(false);
  };

  const handleDelete = (id) => {
    setStaff(staff.filter(s => s.id !== id));
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
      <div className="container">
        <div className="row mb-4">
          <div className="col-12 d-flex justify-content-between align-items-center">
            <h2 className="display-5"><FaUserShield className="me-3" /> Staff Management</h2>
            <button className="btn btn-custom" onClick={() => setShowModal(true)}>
              <FaUserPlus className="me-2" /> Add Staff
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="row mb-4">
          <div className="col-md-3 mb-3">
            <div className="stat-card">
              <h3>{staff.length}</h3>
              <p>Total Staff</p>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="stat-card">
              <h3 className="text-success">{staff.filter(s => s.status === 'Active').length}</h3>
              <p>Active</p>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="stat-card">
              <h3 className="text-warning">{staff.filter(s => s.status === 'Inactive').length}</h3>
              <p>Inactive</p>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="stat-card">
              <h3>{staff.reduce((acc, s) => acc + s.assignedTasks, 0)}</h3>
              <p>Total Tasks</p>
            </div>
          </div>
        </div>

        {/* Staff Table */}
        <div className="row">
          <div className="col-12">
            <div className="card-custom">
              <div className="card-header">
                <h5 className="mb-0">Staff List</h5>
              </div>
              <div className="card-body p-0">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Phone</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Assigned Tasks</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staff.map((member) => (
                      <tr>
                        <td><strong>{member.id}</strong></td>
                        <td>{member.name}</td>
                        <td>{member.role}</td>
                        <td>{member.phone}</td>
                        <td>{member.email}</td>
                        <td>
                          <span className={`badge ${member.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                            {member.status}
                          </span>
                        </td>
                        <td>{member.assignedTasks}</td>
                        <td>
                          <button className="btn btn-sm btn-primary"><FaEdit /></button>
                          <button className="btn btn-sm btn-danger ms-1" onClick={() => handleDelete(member.id)}><FaTrash /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Add Staff Modal */}
        {showModal && (
          <div className="modal fade show" style={{ display: 'block' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add New Staff</h5>
                  <button className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <input className="form-control mb-3" placeholder="Name" value={newStaff.name} onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })} />
                  <input className="form-control mb-3" placeholder="Role" value={newStaff.role} onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })} />
                  <input className="form-control mb-3" placeholder="Phone" value={newStaff.phone} onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })} />
                  <input className="form-control mb-3" placeholder="Email" value={newStaff.email} onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })} />
                  <select className="form-select mb-3" value={newStaff.status} onChange={(e) => setNewStaff({ ...newStaff, status: e.target.value })}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button className="btn btn-custom" onClick={handleAddStaff}>Add Staff</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StaffManagement;
