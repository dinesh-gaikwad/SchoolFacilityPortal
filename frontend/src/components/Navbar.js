import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa';

function Navbar() {
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setShowMenu(false);
    navigate('/');
  };

  const navStyle = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '1rem 0',
    position: 'sticky',
    top: '0',
    zIndex: '1000'
  };

  return (
    <nav style={navStyle}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          <Link to="/" className="text-white fs-4 fw-bold">
            🏫 School Facility Portal
          </Link>

          {/* Desktop Menu */}
          <div className="d-none d-md-flex gap-3">
            <Link to="/" className="text-white text-decoration-none">Home</Link>
            <Link to="/about" className="text-white text-decoration-none">About</Link>
            <Link to="/contact" className="text-white text-decoration-none">Contact</Link>
            <Link to="/faq" className="text-white text-decoration-none">FAQ</Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className="text-white text-decoration-none">Dashboard</Link>
                <Link to="/report-issue" className="text-white text-decoration-none">Report Issue</Link>
                <Link to="/track-issues" className="text-white text-decoration-none">Track Issues</Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-white text-decoration-none">Admin</Link>
                )}
                <div className="dropdown">
                  <button className="btn btn-outline-light dropdown-toggle" type="button">
                    <FaUser className="me-1" /> {user.name}
                  </button>
                  <div className="dropdown-menu">
                    <Link className="dropdown-item" to="/profile">Profile</Link>
                    <Link className="dropdown-item" to="/settings">Settings</Link>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <FaSignOutAlt className="me-1" /> Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-light">Login</Link>
                <Link to="/register" className="btn btn-light">Register</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="btn btn-outline-light d-md-none" onClick={() => setShowMenu(!showMenu)}>
            {showMenu ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        {showMenu && (
          <div className="mt-3 d-md-none bg-white rounded p-3">
            <Link to="/" className="d-block text-dark text-decoration-none py-2">Home</Link>
            <Link to="/about" className="d-block text-dark text-decoration-none py-2">About</Link>
            <Link to="/contact" className="d-block text-dark text-decoration-none py-2">Contact</Link>
            <Link to="/faq" className="d-block text-dark text-decoration-none py-2">FAQ</Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className="d-block text-dark text-decoration-none py-2">Dashboard</Link>
                <Link to="/report-issue" className="d-block text-dark text-decoration-none py-2">Report Issue</Link>
                <Link to="/track-issues" className="d-block text-dark text-decoration-none py-2">Track Issues</Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="d-block text-dark text-decoration-none py-2">Admin Panel</Link>
                )}
                <Link to="/profile" className="d-block text-dark text-decoration-none py-2">Profile</Link>
                <Link to="/settings" className="d-block text-dark text-decoration-none py-2">Settings</Link>
                <button className="btn btn-outline-danger w-100 mt-2" onClick={handleLogout}>
                  <FaSignOutAlt className="me-2" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-primary w-100 mb-2">Login</Link>
                <Link to="/register" className="btn btn-primary w-100">Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
