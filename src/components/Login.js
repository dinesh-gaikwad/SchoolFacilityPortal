import React, { useState } from 'react';

function Login({ onLogin }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('parent');
  const [schoolId, setSchoolId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !schoolId) return alert('Name and School ID required');
    
    setIsLoading(true);
    setTimeout(() => {
      onLogin({ name, role, schoolId });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="login-container animate-fade-in">
      <div className="login-card">
        <div className="card login-card shadow-lg">
          <div className="login-header">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="white">
              <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z"/>
            </svg>
            <h4>School Facility Portal</h4>
            <p style={{opacity: 0.9, marginTop: '0.5rem'}}>Report & Track Infrastructure Issues</p>
          </div>
          
          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label">Full Name</label>
                <input 
                  className="form-control" 
                  placeholder="Enter your name" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  required 
                  style={{height: '50px'}}
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Role</label>
                <select 
                  className="form-select" 
                  value={role} 
                  onChange={e => setRole(e.target.value)}
                  style={{height: '50px'}}
                >
                  <option value="parent">Parent</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label">School ID</label>
                <input 
                  className="form-control" 
                  placeholder="Enter school ID (e.g., SCH001)" 
                  value={schoolId} 
                  onChange={e => setSchoolId(e.target.value)} 
                  required 
                  style={{height: '50px'}}
                />
              </div>

              <button 
                className="btn btn-primary w-100" 
                type="submit"
                disabled={isLoading}
                style={{height: '50px', fontSize: '1rem'}}
              >
                {isLoading ? (
                  <span className="spinner d-inline" style={{width: '20px', height: '20px', borderTopColor: 'white'}}></span>
                ) : 'Login to Portal'}
              </button>

              <div className="text-center mt-4">
                <p className="text-muted small">
                  🔒 Secure login • Powered by Unified Mentor
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
