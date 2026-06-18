import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    await authAPI.register({ name, email, password });
    navigate('/login');
  };
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header"><h3>Register</h3></div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3"><label>Name</label><input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required /></div>
                <div className="mb-3"><label>Email</label><input type="email" className="formcontrol" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
                <div className="mb-3"><label>Password</label><input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
                <button type="submit" className="btn btn-primary">Register</button>
              </form>
              <p className="mt-3"><Link to="/login">Login</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Register;
