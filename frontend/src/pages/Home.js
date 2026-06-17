import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationCircle, FaTachometerAlt, FaList, FaShieldAlt, FaUsers, FaCheckCircle, FaUserPlus, FaSignInAlt } from 'react-icons/fa';

function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <h1><FaExclamationCircle className="me-3" /> School Facility Portal</h1>
          <p>Report Infrastructure Issues • Track Repairs • Ensure Student Safety</p>
          <div className="d-flex gap-3 justify-content-center mt-4">
            <Link to="/register" className="btn btn-custom btn-lg">
              <FaUserPlus className="me-2" /> Get Started
            </Link>
            <Link to="/login" className="btn btn-outline-light btn-lg">
              <FaSignInAlt className="me-2" /> Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5 font-weight-bold">Why Choose Our Portal?</h2>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card-custom h-100">
                <div className="card-header">
                  <FaExclamationCircle className="me-2" /> Easy Reporting
                </div>
                <div className="card-body">
                  <p>Report facility issues instantly with photos, descriptions, and location details.</p>
                  <Link to="/report-issue" className="btn btn-custom">Report Now</Link>
                </div>
              </div>
            </div>
            
            <div className="col-md-4 mb-4">
              <div className="card-custom h-100">
                <div className="card-header">
                  <FaList className="me-2" /> Real-Time Tracking
                </div>
                <div className="card-body">
                  <p>Track repair status in real-time. View timeline and get instant notifications.</p>
                  <Link to="/track-issues" className="btn btn-custom">Track Issues</Link>
                </div>
              </div>
            </div>
            
            <div className="col-md-4 mb-4">
              <div className="card-custom h-100">
                <div className="card-header">
                  <FaShieldAlt className="me-2" /> Student Safety
                </div>
                <div className="card-body">
                  <p>Ensure safe learning environments by addressing infrastructure hazards quickly.</p>
                  <Link to="/about" className="btn btn-custom">Learn More</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5">Our Impact</h2>
          <div className="row">
            <div className="col-md-3 mb-4">
              <div className="stat-card">
                <h3>500+</h3>
                <p>Issues Reported</p>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="stat-card">
                <h3>450+</h3>
                <p>Issues Resolved</p>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="stat-card">
                <h3>25</h3>
                <p>Schools Joined</p>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="stat-card">
                <h3>95%</h3>
                <p>Resolution Rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5">How It Works</h2>
          <div className="row">
            <div className="col-md-3 text-center mb-4">
              <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px', fontSize: '30px'}}>1</div>
              <h5>Register/Login</h5>
              <p>Create account or login with school ID</p>
            </div>
            <div className="col-md-3 text-center mb-4">
              <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px', fontSize: '30px'}}>2</div>
              <h5>Report Issue</h5>
              <p>Submit issue with photos and location</p>
            </div>
            <div className="col-md-3 text-center mb-4">
              <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px', fontSize: '30px'}}>3</div>
              <h5>Track Progress</h5>
              <p>Monitor repair status real-time</p>
            </div>
            <div className="col-md-3 text-center mb-4">
              <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px', fontSize: '30px'}}>4</div>
              <h5>Get Resolved</h5>
              <p>Receive notification when fixed</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-primary text-white text-center">
        <div className="container">
          <h2 className="mb-4">Ready to Improve Your School?</h2>
          <p className="mb-4">Join our platform and help create safer learning environments</p>
          <Link to="/register" className="btn btn-custom btn-lg">
            <FaUserPlus className="me-2" /> Register Now
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
