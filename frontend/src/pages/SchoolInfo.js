import React, { useState, useEffect } from 'react';
import { FaSchool, FaEdit, FaSave } from 'react-icons/fa';

function SchoolInfo() {
  const [user] = useState(() => localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null);
  const [isEditing, setIsEditing] = useState(false);
  const [school, setSchool] = useState({
    name: 'Pune International School',
    schoolId: 'SCH001',
    address: '123 Education Street, Pune, Maharashtra 411001',
    phone: '+91 98765 43210',
    email: 'info@puneinternationalschool.com',
    totalStudents: 1500,
    totalTeachers: 120,
    totalClassrooms: 45
  });

  useEffect(() => {
    if (user?.role !== 'admin') window.location.href = '/dashboard';
  }, [user]);

  const handleSave = () => {
    setIsEditing(false);
    alert('School information updated successfully!');
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
            <h2 className="display-5"><FaSchool className="me-3" /> School Information</h2>
            <button className="btn btn-custom" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? <FaSave className="me-2" /> : <FaEdit className="me-2" />}
              {isEditing ? 'Save' : 'Edit'}
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-4">
            <div className="card-custom">
              <div className="card-header">
                <h5 className="mb-0">Basic Information</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">School Name</label>
                  <input className="form-control" value={school.name} disabled={!isEditing} onChange={(e) => setSchool({ ...school, name: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label">School ID</label>
                  <input className="form-control" value={school.schoolId} disabled />
                </div>
                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <textarea className="form-control" rows="3" value={school.address} disabled={!isEditing} onChange={(e) => setSchool({ ...school, address: e.target.value })} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6 mb-4">
            <div className="card-custom">
              <div className="card-header">
                <h5 className="mb-0">Contact Information</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <input className="form-control" value={school.phone} disabled={!isEditing} onChange={(e) => setSchool({ ...school, phone: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input className="form-control" value={school.email} disabled={!isEditing} onChange={(e) => setSchool({ ...school, email: e.target.value })} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-12">
            <div className="card-custom">
              <div className="card-header">
                <h5 className="mb-0">School Statistics</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4">
                    <div className="stat-card">
                      <h3>{school.totalStudents}</h3>
                      <p>Total Students</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="stat-card">
                      <h3>{school.totalTeachers}</h3>
                      <p>Total Teachers</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="stat-card">
                      <h3>{school.totalClassrooms}</h3>
                      <p>Total Classrooms</p>
                    </div>
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

export default SchoolInfo;
