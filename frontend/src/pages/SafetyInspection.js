import React from 'react';
import { FaShieldAlt } from 'react-icons/fa';
function SafetyInspection() {
  return (
    <div className="py-5">
      <div className="container">
        <h2><FaShieldAlt className="me-3" /> Safety Inspection</h2>
        <div className="card-custom mt-4">
          <div className="card-body">
            <p>Schedule and track safety inspections</p>
            <table className="table">
              <thead><tr><th>Date</th><th>Area</th><th>Type</th><th>Status</th><th>Findings</th></tr></thead>
              <tbody>
                <tr><td>2026-06-15</td><td>Electrical Room</td><td>Electrical Safety</td><td><span className="badge bg-success">Passed</span></td><td>No issues</td></tr>
                <tr><td>2026-06-20</td><td>Playground</td><td>Structural</td><td><span className="badge bg-info">Scheduled</span></td><td>-</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
export default SafetyInspection;
