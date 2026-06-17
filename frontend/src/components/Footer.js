import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

function Footer() {
  const footerStyle = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '3rem 0'
  };

  return (
    <footer style={footerStyle}>
      <div className="container">
        <div className="row">
          {/* About Section */}
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold mb-3">🏫 School Facility Portal</h5>
            <p>Creating safe learning environments by enabling schools, parents, and teachers to report and track infrastructure issues efficiently.</p>
            <div className="d-flex gap-3">
              <a href="#" className="text-white"><FaFacebook size={24} /></a>
              <a href="#" className="text-white"><FaTwitter size={24} /></a>
              <a href="#" className="text-white"><FaInstagram size={24} /></a>
              <a href="#" className="text-white"><FaLinkedin size={24} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-md-2 mb-4">
            <h6 className="fw-bold mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/" className="text-white text-decoration-none">Home</Link></li>
              <li className="mb-2"><Link to="/about" className="text-white text-decoration-none">About</Link></li>
              <li className="mb-2"><Link to="/contact" className="text-white text-decoration-none">Contact</Link></li>
              <li className="mb-2"><Link to="/faq" className="text-white text-decoration-none">FAQ</Link></li>
              <li className="mb-2"><Link to="/help" className="text-white text-decoration-none">Help Center</Link></li>
            </ul>
          </div>

          {/* Features */}
          <div className="col-md-2 mb-4">
            <h6 className="fw-bold mb-3">Features</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/report-issue" className="text-white text-decoration-none">Report Issue</Link></li>
              <li className="mb-2"><Link to="/track-issues" className="text-white text-decoration-none">Track Issues</Link></li>
              <li className="mb-2"><Link to="/dashboard" className="text-white text-decoration-none">Dashboard</Link></li>
              <li className="mb-2"><Link to="/admin" className="text-white text-decoration-none">Admin Panel</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-md-4 mb-4">
            <h6 className="fw-bold mb-3">Contact Us</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <FaMapMarkerAlt className="me-2" />
                123 Education Street, Pune, Maharashtra 411001
              </li>
              <li className="mb-2">
                <FaPhone className="me-2" />
                +91 98765 43210
              </li>
              <li className="mb-2">
                <FaEnvelope className="me-2" />
                support@schoolfacilityportal.com
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="row mt-4 pt-4 border-top">
          <div className="col-12 text-center">
            <p>&copy; 2026 School Facility Portal. All rights reserved.</p>
            <div className="d-flex justify-content-center gap-3">
              <Link to="/privacy-policy" className="text-white text-decoration-none">Privacy Policy</Link>
              <Link to="/terms-of-service" className="text-white text-decoration-none">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
