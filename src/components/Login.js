import React, { useState } from 'react';

function Login({ onLogin }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('parent');
  const [schoolId, setSchoolId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !schoolId) return alert('Name and School ID required');
    onLogin({ name, role, schoolId });
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-5">
        <div className="card shadow">
          <div className="card-header bg-primary text-white">
            <h4>Login</h4>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <input className="form-control mb-3" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
              <select className="form-control mb-3" value={role} onChange={e => setRole(e.target.value)}>
                <option value="parent">Parent</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
              <input className="form-control mb-3" placeholder="School ID" value={schoolId} onChange={e => setSchoolId(e.target.value)} />
              <button className="btn btn-primary w-100" type="submit">Login</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
