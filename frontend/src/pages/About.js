import React from 'react';
import { FaInfoCircle, FaUsers, FaBullseye, FaHandshake, FaSchool } from 'react-icons/fa';

function About() {
  return (
    <div className="py-5">
      <div className="container">
        {/* Hero Section */}
        <div className="row mb-5 text-center">
          <div className="col-12">
            <h1 className="display-4"><FaInfoCircle className="me-3" /> About School Facility Portal</h1>
            <p className="lead">Creating Safe Learning Environments for All Students</p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="row mb-5">
          <div className="col-md-6">
            <div className="card-custom">
              <div className="card-body p-4">
                <FaBullseye className="mb-3" style={{ fontSize: '3rem', color: '#667eea' }} />
                <h3>Our Mission</h3>
                <p>To provide a digital platform that enables schools, parents, and teachers to report, track, and resolve infrastructure issues efficiently, ensuring safe and conducive learning environments for students.</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card-custom">
              <div className="card-body p-4">
                <FaEye className="mb-3" style={{ fontSize: '3rem', color: '#764ba2' }} />
                <h3>Our Vision</h3>
                <p>A world where every school has well-maintained infrastructure, and no safety concern goes unaddressed. We envision a future where technology empowers communities to take proactive action.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Problem Statement */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="card-custom">
              <div className="card-header">
                <h3 className="mb-0">The Problem We Solve</h3>
              </div>
              <div className="card-body p-4">
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <FaSchool className="mb-2" style={{ fontSize: '2rem', color: '#ffc107' }} />
                    <h5>Infrastructure Issues</h5>
                    <p>Broken furniture, unsafe classrooms, damaged toilets, poor sanitation, and electrical hazards often go unreported.</p>
                  </div>
                  <div className="col-md-4 mb-3">
                    <FaUsers className="mb-2" style={{ fontSize: '2rem', color: '#0d6efd' }} />
                    <h5>Lack of Communication</h5>
                    <p>No centralized system for parents, teachers, and administration to communicate about facility issues.</p>
                  </div>
                  <div className="col-md-4 mb-3">
                    <FaHandshake className="mb-2" style={{ fontSize: '2rem', color: '#198754' }} />
                    <h5>Delayed Repairs</h5>
                    <p>Lack of transparency and accountability leads to delayed maintenance and unresolved issues.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Impact */}
        <div className="row mb-5 bg-light p-4 rounded">
          <div className="col-12 text-center">
            <h3 className="mb-4">Our Impact So Far</h3>
            <div className="row">
              <div className="col-md-3">
                <h2 className="text-primary">500+</h2>
                <p>Issues Reported</p>
              </div>
              <div className="col-md-3">
                <h2 className="text-success">450+</h2>
                <p>Issues Resolved</p>
              </div>
              <div className="col-md-3">
                <h2 className="text-info">25</h2>
                <p>Schools Joined</p>
              </div>
              <div className="col-md-3">
                <h2 className="text-warning">95%</h2>
                <p>Resolution Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Partners Section */}
        <div className="row mb-5">
          <div className="col-12">
            <h3 className="text-center mb-4">Our Partners & Supporters</h3>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card-custom text-center p-4">
              <h5>Ministry of Education</h5>
              <p className="text-muted">School infrastructure policies and educational standards</p>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card-custom text-center p-4">
              <h5>Samagra Shiksha Abhiyan</h5>
              <p className="text-muted">School development and infrastructure improvement initiative</p>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card-custom text-center p-4">
              <h5>UNICEF</h5>
              <p className="text-muted">Child-friendly school environments and infrastructure support</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="row">
          <div className="col-12 text-center">
            <div className="card-custom bg-primary text-white p-5">
              <h3>Join Our Mission</h3>
              <p className="mb-4">Help us create safer learning environments for students</p>
              <button onClick={() => window.location.href = '/register'} className="btn btn-light btn-lg">
                Get Started Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
