import React from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
function RepairSchedule() {
  return (
    <div className="py-5">
      <div className="container">
        <h2><FaCalendarAlt className="me-3" /> Repair Schedule</h2>
        <div className="card-custom mt-4">
          <div className="card-body">
            <p>View and manage scheduled repairs</p>
            <div className="table-responsive">
              <table className="table">
                <thead><tr><th>Date</th><th>Facility</th><th>Issue</th><th>Staff</th><th>Status</th></tr></thead>
                <tbody>
                  <tr><td>2026-06-18</td><td>Room 101</td><td>Broken Chair</td><td>Rajesh Kumar</td><td><span className="badge bg-warning">Scheduled</span></td></tr>
                  <tr><td>2026-06-19</td><td>Toilet Block A</td><td>Leaking Pipe</td><td>Suresh Patel</td><td><span className="badge bg-info">In Progress</span></td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default RepairSchedule;
