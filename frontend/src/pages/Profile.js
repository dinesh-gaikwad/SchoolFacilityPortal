import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaSchool, FaLock, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    schoolId: '',
    role: '',
    address: ''
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setFormData({
        name: parsedUser.name || '',
        email: parsedUser.email || '',
        phone: parsedUser.phone || '',
        schoolId: parsedUser.schoolId || '',
        role: parsedUser.role || '',
        address: parsedUser.address || ''
      });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const updatedUser = { ...user, ...formData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      schoolId: user.schoolId || '',
      role: user.role || '',
      address: user.address || ''
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="py-5 text-center">
        <div className="alert alert-warning">Please login to view profile</div>
        <button onClick={() => navigate('/login')} className="btn btn-custom">Go to Login</button>
      </div>
    );
  }

  return (
    <div className="py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-7">
            <div className="card-custom">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h3><FaUser className="me-2" /> My Profile</h3>
                {!isEditing && (
                  <button className="btn btn-sm btn-outline-light" onClick={() => setIsEditing(true)}>
                    <FaEdit className="me-1" /> Edit
                  </button>
                )}
              </div>
              <div className="card-body p-4">
                {/* Profile Avatar */}
                <div className="text-center mb-4">
                  <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '100px', height: '100px', fontSize: '40px'}}>
                    <FaUser />
                  </div>
                  <h4>{user.name}</h4>
                  <span className="badge bg-primary">{user.role}</span>
                </div>

                <form>
                  <div className="mb-3">
                    <label className="form-label"><FaUser className="me-2" /> Full Name</label>
                    <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} disabled={!isEditing} />
                  </div>

                  <div className="mb-3">
                    <label className="form-label"><FaEnvelope className="me-2" /> Email</label>
                    <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} disabled={!isEditing} />
                  </div>

                  <div className="mb-3">
                    <label className="form-label"><FaPhone className="me-2" /> Phone</label>
                    <input type="tel" name="phone" className="form-control" value={formData.phone} onChange={handleChange} disabled={!isEditing} />
                  </div>

                  <div className="mb-3">
                    <label className="form-label"><FaSchool className="me-2" /> School ID</label>
                    <input type="text" name="schoolId" className="form-control" value={formData.schoolId} onChange={handleChange} disabled={!isEditing} />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Role</label>
                    <input type="text" className="form-control" value={formData.role} disabled />
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Address</label>
                    <textarea name="address" className="form-control" rows="3" value={formData.address} onChange={handleChange} disabled={!isEditing} />
                  </div>

                  {isEditing && (
                    <div className="d-flex gap-2">
                      <button type="button" className="btn btn-custom" onClick={handleSave}>
                        <FaSave className="me-2" /> Save Changes
                      </button>
                      <button type="button" className="btn btn-outline-secondary" onClick={handleCancel}>
                        <FaTimes className="me-2" /> Cancel
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Account Info */}
            <div className="card-custom mt-4">
              <div className="card-header">
                <h5 className="mb-0"><FaLock className="me-2" /> Account Information</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-2">
                    <strong>Account Created:</strong> {user.createdAt || 'N/A'}
                  </div>
                  <div className="col-md-6 mb-2">
                    <strong>Account Status:</strong> <span className="badge bg-success">Active</span>
                  </div>
                </div>
                <button className="btn btn-outline-danger mt-2" onClick={() => {
                  localStorage.removeItem('user');
                  navigate('/');
                }}>
                  <FaTimes className="me-2" /> Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
