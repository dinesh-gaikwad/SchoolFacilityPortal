import React from 'react';
import { FaBuilding, FaSearch } from 'react-icons/fa';
function FacilityList() {
  return (
    <div className="py-5">
      <div className="container">
        <h2 className="display-5"><FaBuilding className="me-3" /> Facility List</h2>
        <div className="card-custom mt-4">
          <div className="card-body">
            <p>Manage all school facilities and rooms</p>
            <table className="table">
              <thead><tr><th>ID</th><th>Facility Name</th><th>Type</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                <tr><td>1</td><td>Room 101</td><td>Classroom</td><td><span className="badge bg-success">Active</span></td><td><button className="btn btn-sm btn-primary">View</button></td></tr>
                <tr><td>2</td><td>Library</td><td>Common Area</td><td><span className="badge bg-success">Active</span></td><td><button className="btn btn-sm btn-primary">View</button></td></tr>
                <tr><td>3</td><td>Laboratory</td><td>Science Lab</td><td><span className="badge bg-warning">Maintenance</span></td><td><button className="btn btn-sm btn-primary">View</button></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
export default FacilityList;
