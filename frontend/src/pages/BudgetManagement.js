import React from 'react';
import { FaMoneyBill } from 'react-icons/fa';
function BudgetManagement() {
  return (
    <div className="py-5">
      <div className="container">
        <h2><FaMoneyBill className="me-3" /> Budget Management</h2>
        <div className="card-custom mt-4">
          <div className="card-body">
            <p>Track maintenance budget and expenses</p>
            <div className="row">
              <div className="col-md-4"><div className="stat-card"><h3>₹500,000</h3><p>Total Budget</p></div></div>
              <div className="col-md-4"><div className="stat-card"><h3>₹350,000</h3><p>Used</p></div></div>
              <div className="col-md-4"><div className="stat-card"><h3>₹150,000</h3><p>Remaining</p></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default BudgetManagement;
