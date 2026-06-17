import React from 'react';
import { FaBox } from 'react-icons/fa';
function Inventory() {
  return (
    <div className="py-5">
      <div className="container">
        <h2><FaBox className="me-3" /> Inventory Management</h2>
        <div className="card-custom mt-4">
          <div className="card-body">
            <p>Track maintenance supplies and materials</p>
            <table className="table">
              <thead><tr><th item>Item</th><th>Quantity</th><th>Unit</th><th>Status</th></tr></thead>
              <tbody>
                <tr><td>Chairs</td><td>150</td><td>pieces</td><td><span className="badge bg-success">Good</span></td></tr>
                <tr><td>Paint</td><td>25</td><td>buckets</td><td><span className="badge bg-warning">Low</span></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Inventory;
