import React from 'react';
import { FaTruck } from 'react-icons/fa';
function VendorList() {
  return (
    <div className="py-5">
      <div className="container">
        <h2><FaTruck className="me-3" /> Vendor List</h2>
        <div className="card-custom mt-4">
          <div className="card-body">
            <p>Manage external vendors and service providers</p>
            <table className="table">
              <thead><tr><th>Name</th><th>Service</th><th>Phone</th><th>Email</th><th>Status</th></tr></thead>
              <tbody>
                <tr><td>Mumbai Electric Services</td><td>Electrical</td><td>9876543220</td><td>mumbai@example.com</td><td><span className="badge bg-success">Active</span></td></tr>
                <tr><td>Pune Plumbing Co.</td><td>Plumbing</td><td>9876543221</td><td>pune@example.com</td><td><span className="badge bg-success">Active</span></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
export default VendorList;
