import React from 'react';
import { FaChartPie } from 'react-icons/fa';
function Analytics() {
  return (
    <div className="py-5">
      <div className="container">
        <h2><FaChartPie className="me-3" /> Analytics Dashboard</h2>
        <div className="card-custom mt-4">
          <div className="card-body">
            <p>Visual analytics and insights</p>
            <div className="row">
              <div className="col-md-6"><div className="stat-card"><h3>90%</h3><p>Resolution Rate</p></div></div>
              <div className="col-md-6"><div className="stat-card"><h3>5.2 days</h3><p>Avg. Resolution Time</p></div></div>
            </div>
            <div className="bg-light mt-4 p-5 text-center">
              <p>Charts will be displayed here (Chart.js integration)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Analytics;
