import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { issuesAPI } from '../services/api';
import { FaExclamationTriangle } from 'react-icons/fa';

function IssueReport() {
  const navigate = useNavigate();
  const [user] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const [formData, setFormData] = useState({
    description: '',
    category: 'Furniture',
    location: '',
    priority: 'Medium'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await issuesAPI.create(formData);
      alert('Issue reported successfully!');
      navigate('/track-issues');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to report issue');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="py-5 text-center">
        <div className="alert alert-warning">Please login to report issues</div>
        <button onClick={() => window.location.href = '/login'} className="btn btn-custom">Go to Login</button>
      </div>
    );
  }

  return (
    <div className="py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card-custom">
              <div className="card-header">
                <h3 className="mb-0"><FaExclamationTriangle className="me-2" /> Report New Issue</h3>
              </div>
              <div className="card-body p-4">
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select name="category" className="form-select" value={formData.category} onChange={handleChange} required>
                      <option value="Furniture">Furniture</option>
                      <option value="Electrical">Electrical</option>
                      <option value="Plumbing">Plumbing</option>
                      <option value="Sanitation">Sanitation</option>
                      <option value="Classroom">Classroom</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Location</label>
                    <input type="text" name="location" className="form-control" value={formData.location} onChange={handleChange} placeholder="e.g., Room 101, Library" required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Priority</label>
                    <select name="priority" className="form-select" value={formData.priority} onChange={handleChange} required>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Description</label>
                    <textarea name="description" className="form-control" rows="5" value={formData.description} onChange={handleChange} placeholder="Describe the issue in detail..." required />
                  </div>
                  <button type="submit" className="btn btn-custom w-100" disabled={loading}>
                    {loading ? 'Submitting...' : 'Report Issue'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IssueReport;
