import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
function ComplaintList() {
  return (
    <div className="py-5">
      <div className="container">
        <h2><FaExclamationTriangle className="me-3" /> Complaint List</h2>
        <div className="card-custom mt-4">
          <div className="card-body">
            <p>View and manage all complaints</p>
            <table className="table">
              <thead><tr><th>ID</th><th>Complaint</th><th>Submitted By</th><th>Date</th><th>Status</th></tr></thead>
              <tbody>
                <tr><td>101</td><td>Noisy Classroom</td><td>Teacher</td><td>2026-06-14</td><td><span className="badge bg-warning">Pending</span></td></tr>
                <tr><td>102</td><td>Broken AC</td><td>Student</td><td>2026-06-15</td><td><span className="badge bg-info">In Progress</span></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ComplaintList;
