import React, { useState, useEffect } from 'react';
import { FaChartLine, FaFilePdf, FaFileExcel, FaCalendar, FaFilter, FaDownload } from 'react-icons/fa';

function Reports() {
  const [user] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  
  const [reportType, setReportType] = useState('summary');
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState('2026-06-17');
  const [reports, setReports] = useState(null);

  useEffect(() => {
    if (user?.role !== 'admin') {
      window.location.href = '/dashboard';
    }
  }, [user]);

  const generateReport = () => {
    const sampleData = {
      summary: {
        totalIssues: 500,
        resolvedIssues: 450,
        pendingIssues: 35,
        inProgressIssues: 15,
        resolutionRate: '90%',
        avgResolutionTime: '5.2 days'
      },
      byCategory: [
        { category: 'Furniture', count: 150, resolved: 140 },
        { category: 'Electrical', count: 120, resolved: 110 },
        { category: 'Plumbing', count: 100, resolved: 95 },
        { category: 'Sanitation', count: 80, resolved: 70 },
        { category: 'Classroom', count: 50, resolved: 45 }
      ],
      byPriority: [
        { priority: 'Critical', count: 50, resolved: 48 },
        { priority: 'High', count: 150, resolved: 140 },
        { priority: 'Medium', count: 200, resolved: 180 },
        { priority: 'Low', count: 100, resolved: 90 }
      ]
    };
    setReports(sampleData[reportType] || sampleData.summary);
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="py-5 text-center">
        <div className="alert alert-warning">Admin access required</div>
        <button onClick={() => window.location.href = '/login'} className="btn btn-custom">Go to Login</button>
      </div>
    );
  }

  return (
    <div className="py-5">
      <div className="container">
        <div className="row mb-4">
          <div className="col-12">
            <h2 className="display-5"><FaChartLine className="me-3" /> Reports & Analytics</h2>
            <p className="text-muted">Generate comprehensive reports on facility issues</p>
          </div>
        </div>

        {/* Report Filters */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card-custom">
              <div className="card-header">
                <h5 className="mb-0"><FaFilter className="me-2" /> Report Filters</h5>
              </div>
              <div className="card-body p-4">
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Report Type</label>
                    <select className="form-select" value={reportType} onChange={(e) => setReportType(e.target.value)}>
                      <option value="summary">Summary Report</option>
                      <option value="byCategory">By Category</option>
                      <option value="byPriority">By Priority</option>
                      <option value="monthly">Monthly Report</option>
                      <option value="staffPerformance">Staff Performance</option>
                    </select>
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label"><FaCalendar className="me-2" /> Start Date</label>
                    <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label"><FaCalendar className="me-2" /> End Date</label>
                    <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                  </div>
                  <div className="col-md-2 mb-3">
                    <label className="form-label">&nbsp;</label>
                    <button className="btn btn-custom w-100" onClick={generateReport}>
                      <FaChartLine className="me-2" /> Generate
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Report */}
        {reportType === 'summary' && reports && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="card-custom">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Summary Report</h5>
                  <div>
                    <button className="btn btn-sm btn-outline-danger"><FaFilePdf className="me-1" /> PDF</button>
                    <button className="btn btn-sm btn-outline-success"><FaFileExcel className="me-1" /> Excel</button>
                  </div>
                </div>
                <div className="card-body p-4">
                  <div className="row">
                    <div className="col-md-2 mb-3">
                      <div className="stat-card">
                        <h3>{reports.totalIssues}</h3>
                        <p>Total Issues</p>
                      </div>
                    </div>
                    <div className="col-md-2 mb-3">
                      <div className="stat-card">
                        <h3 className="text-success">{reports.resolvedIssues}</h3>
                        <p>Resolved</p>
                      </div>
                    </div>
                    <div className="col-md-2 mb-3">
                      <div className="stat-card">
                        <h3 className="text-warning">{reports.pendingIssues}</h3>
                        <p>Pending</p>
                      </div>
                    </div>
                    <div className="col-md-2 mb-3">
                      <div className="stat-card">
                        <h3 className="text-info">{reports.inProgressIssues}</h3>
                        <p>In Progress</p>
                      </div>
                    </div>
                    <div className="col-md-2 mb-3">
                      <div className="stat-card">
                        <h3 className="text-primary">{reports.resolutionRate}</h3>
                        <p>Resolution Rate</p>
                      </div>
                    </div>
                    <div className="col-md-2 mb-3">
                      <div className="stat-card">
                        <h3 className="text-secondary">{reports.avgResolutionTime}</h3>
                        <p>Avg. Time</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* By Category Report */}
        {reportType === 'byCategory' && reports && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="card-custom">
                <div className="card-header">
                  <h5 className="mb-0">Issues by Category</h5>
                </div>
                <div className="card-body p-0">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Total Issues</th>
                        <th>Resolved</th>
                        <th>Pending</th>
                        <th>Resolution Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reports.map((item, index) => (
                        <tr>
                          <td><strong>{item.category}</strong></td>
                          <td>{item.count}</td>
                          <td className="text-success">{item.resolved}</td>
                          <td className="text-warning">{item.count - item.resolved}</td>
                          <td>{Math.round((item.resolved / item.count) * 100)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Export Options */}
        <div className="row">
          <div className="col-12 text-center">
            <button className="btn btn-custom btn-lg">
              <FaDownload className="me-2" /> Download All Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;
