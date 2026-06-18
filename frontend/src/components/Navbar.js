import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
function Navbar() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  return (
    <nav className="navbar navbar-expand navbar-dark bg-primary">
      <Link className="navbar-brand" to="/">School Portal</Link>
      <div className="navbar-nav">
        <Link className="nav-item nav-link" to="/">Dashboard</Link>
        <Link className="nav-item nav-link" to="/issues">Issues</Link>
        <Link className="nav-item nav-link" to="/staff">Staff</Link>
        <Link className="nav-item nav-link" to="/facilities">Facilities</Link>
      </div>
      <div className="navbar-nav ms-auto">
        {user.name ? (
          <><span className="nav-item nav-link">{user.name}</span>
          <button className="nav-item nav-link" onClick={handleLogout}>Logout</button></>
        ) : (
          <><Link className="nav-item nav-link" to="/login">Login</Link>
          <Link className="nav-item nav-link" to="/register">Register</Link></>
        )}
      </div>
    </nav>
  );
}
export default Navbar;
