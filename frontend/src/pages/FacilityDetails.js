import React from 'react';
import { FaBuilding, FaArrowLeft } from 'react-icons/fa';
function FacilityDetails() {
  return (
    <div className="py-5">
      <div className="container">
        <button className="btn btn-outline-primary mb-3"><FaArrowLeft className="me-2" /> Back</button>
        <h2><FaBuilding className="me-3" /> Room 101 - Details</h2>
        <div className="card-custom mt-4">
          <div className="card-body">
            <p><strong>Type:</strong> Classroom</p>
            <p><strong>Status:</strong> Active</p>
            <p><strong>Capacity:</strong> 50 students</p>
            <p><strong>Facilities:</strong> Chairs, Tables, Projector, Whiteboard</p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default FacilityDetails;
