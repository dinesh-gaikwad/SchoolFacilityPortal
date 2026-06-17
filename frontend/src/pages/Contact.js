import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="py-5">
      <div className="container">
        <div className="row mb-5 text-center">
          <div className="col-12">
            <h1 className="display-4"><FaEnvelope className="me-3" /> Contact Us</h1>
            <p className="lead">We'd Love to Hear From You</p>
          </div>
        </div>

        <div className="row">
          {/* Contact Info */}
          <div className="col-md-4 mb-4">
            <div className="card-custom">
              <div className="card-header">
                <h5 className="mb-0">Get In Touch</h5>
              </div>
              <div className="card-body p-4">
                <div className="mb-3">
                  <FaPhone className="me-2" style={{ color: '#667eea' }} />
                  <strong>Phone:</strong>
                  <p className="mb-0">+91 98765 43210</p>
                </div>
                <div className="mb-3">
                  <FaEnvelope className="me-2" style={{ color: '#667eea' }} />
                  <strong>Email:</strong>
                  <p className="mb-0">support@schoolfacilityportal.com</p>
                </div>
                <div className="mb-3">
                  <FaMapMarkerAlt className="me-2" style={{ color: '#667eea' }} />
                  <strong>Address:</strong>
                  <p className="mb-0">123 Education Street, Pune, Maharashtra 411001, India</p>
                </div>
                <div className="mt-4">
                  <h6>Follow Us:</h6>
                  <div className="d-flex gap-3">
                    <a href="#" className="text-primary"><FaFacebook size={24} /></a>
                    <a href="#" className="text-info"><FaTwitter size={24} /></a>
                    <a href="#" className="text-danger"><FaInstagram size={24} /></a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="col-md-8 mb-4">
            <div className="card-custom">
              <div className="card-header">
                <h5 className="mb-0">Send Us a Message</h5>
              </div>
              <div className="card-body p-4">
                {submitted && (
                  <div className="alert alert-success mb-3">
                    <FaPaperPlane className="me-2" /> Message sent successfully! We'll respond soon.
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Your Name</label>
                    <input type="text" name="name" className="form-control" placeholder="Enter your name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email Address</label>
                    <input type="email" name="email" className="form-control" placeholder="Enter email" value={formData.email} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Subject</label>
                    <input type="text" name="subject" className="form-control" placeholder="Message subject" value={formData.subject} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Message</label>
                    <textarea name="message" className="form-control" rows="5" placeholder="Write your message" value={formData.message} onChange={handleChange} required />
                  </div>
                  <button type="submit" className="btn btn-custom">
                    <FaPaperPlane className="me-2" /> Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="row">
          <div className="col-12">
            <div className="card-custom">
              <div className="card-header">
                <h5 className="mb-0"><FaMapMarkerAlt className="me-2" /> Our Location</h5>
              </div>
              <div className="card-body p-0">
                <div className="bg-light d-flex align-items-center justify-content-center py-5" style={{ height: '300px' }}>
                  <div className="text-center">
                    <FaMapMarkerAlt style={{ fontSize: '4rem', color: '#667eea' }} />
                    <p className="mt-3"><strong>123 Education Street, Pune, Maharashtra 411001</strong></p>
                    <button className="btn btn-outline-primary">View on Google Maps</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
