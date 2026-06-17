import React from 'react';
import { FaHeadset, FaBook, FaVideo, FaQuestionCircle, FaSearch } from 'react-icons/fa';

function HelpCenter() {
  return (
    <div className="py-5">
      <div className="container">
        <div className="row mb-5 text-center">
          <div className="col-12">
            <h1 className="display-4"><FaHeadset className="me-3" /> Help Center</h1>
            <p className="lead">We're Here to Help You</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="row mb-5">
          <div className="col-md-8 offset-md-2">
            <div className="input-group input-group-lg">
              <input type="text" className="form-control" placeholder="Search for help..." />
              <button className="btn btn-custom" type="button">
                <FaSearch className="me-2" /> Search
              </button>
            </div>
          </div>
        </div>

        {/* Help Categories */}
        <div className="row mb-5">
          <div className="col-12">
            <h3 className="text-center mb-4">Browse Help Topics</h3>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card-custom text-center p-4">
              <FaBook style={{ fontSize: '3rem', color: '#667eea' }} />
              <h5 className="mt-3">Getting Started</h5>
              <p className="text-muted">Learn how to use the portal</p>
              <button className="btn btn-outline-primary">View Guides</button>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card-custom text-center p-4">
              <FaQuestionCircle style={{ fontSize: '3rem', color: '#764ba2' }} />
              <h5 className="mt-3">Reporting Issues</h5>
              <p className="text-muted">How to report facility problems</p>
              <button className="btn btn-outline-primary">View Guides</button>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card-custom text-center p-4">
              <FaVideo style={{ fontSize: '3rem', color: '#0d6efd' }} />
              <h5 className="mt-3">Video Tutorials</h5>
              <p className="text-muted">Watch step-by-step videos</p>
              <button className="btn btn-outline-primary">Watch Videos</button>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="card-custom">
              <div className="card-header">
                <h5 className="mb-0">Quick Links</h5>
              </div>
              <div className="card-body p-4">
                <div className="row">
                  <div className="col-md-3 mb-2">
                    <button onClick={() => window.location.href = '/login'} className="btn btn-outline-primary w-100">Login Help</button>
                  </div>
                  <div className="col-md-3 mb-2">
                    <button onClick={() => window.location.href = '/register'} className="btn btn-outline-primary w-100">Registration Help</button>
                  </div>
                  <div className="col-md-3 mb-2">
                    <button onClick={() => window.location.href = '/report-issue'} className="btn btn-outline-primary w-100">Report Issue Help</button>
                  </div>
                  <div className="col-md-3 mb-2">
                    <button onClick={() => window.location.href = '/track-issues'} className="btn btn-outline-primary w-100">Track Issue Help</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="row">
          <div className="col-12">
            <div className="card-custom bg-primary text-white text-center p-5">
              <FaHeadset style={{ fontSize: '4rem' }} />
              <h3 className="mt-3">Need Personal Assistance?</h3>
              <p className="mb-4">Our support team is available 24/7 to help you</p>
              <button onClick={() => window.location.href = '/contact'} className="btn btn-light btn-lg">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HelpCenter;
