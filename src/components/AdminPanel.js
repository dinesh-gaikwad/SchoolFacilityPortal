import React from 'react';

function AdminPanel({ issues, onUpdateStatus, user }) {
  if (user.role !== 'admin') {
    return (
      <div className="alert alert-danger animate-fade-in">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '10px'}}>
          <path d="M12 2L1 21H23L12 2ZM12 6L19.5 19H4.5L12 6ZM11 10V14H13V10H11ZM11 16V18H13V16H11Z"/>
        </svg>
        <strong>Access Denied!</strong> This page is for Admins only.
      </div>
    );
  }

  const handleAssign = (id) => {
    onUpdateStatus(id, 'In Progress');
  };

  const handleResolve = (id) => {
    onUpdateStatus(id, 'Resolved');
  };

  const pendingCount = issues.filter(i => i.status === 'Pending').length;
  const inProgressCount = issues.filter(i => i.status === 'In Progress').length;
  const resolvedCount = issues.filter(i => i.status === 'Resolved').length;

  return (
    <div className="animate-fade-in">
      <div className="dashboard-hero bg-warning" style={{background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'}}>
        <h3>👨‍💼 Admin Panel</h3>
        <p>Manage & Assign Repair Tasks - Complete Oversight</p>
      </div>

      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="stats-card" style={{borderTop: '5px solid var(--warning-color)'}}>
            <h2 style={{color: 'var(--warning-color)'}}>{pendingCount}</h2>
            <h5>Pending Tasks</h5>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="stats-card" style={{borderTop: '5px solid var(--accent-color)'}}>
            <h2 style={{color: 'var(--accent-color)'}}>{inProgressCount}</h2>
            <h5>In Progress</h5>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="stats-card" style={{borderTop: '5px solid var(--success-color)'}}>
            <h2 style={{color: 'var(--success-color)'}}>{resolvedCount}</h2>
            <h5>Completed</h5>
          </div>
        </div>
      </div>

      <div className="card shadow-lg">
        <div className="card-header bg-warning text-dark">
          <h5 className="m-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '10px'}}>
              <path d="M22.7 19.2L17.3 13.8C17.9 12.8 18.2 11.7 18.2 10.5C18.2 7.4 15.7 4.9 12.6 4.9C9.5 4.9 7 7.4 7 10.5C7 13.6 9.5 16.1 12.6 16.1C12.8 16.1 13 16.1 13.1 16.1L18.7 21.7C19 22 19.4 22.2 19.8 22.2S20.2 22 20.5 21.7L22.7 19.5C23 19.2 23 18.7 22.7 18.4L22.7 19.2ZM12.6 14.3C10.5 14.3 8.8 12.6 8.8 10.5S10.5 8.8 12.6 8.8S14.3 10.5 14.3 12.6S12.6 14.3 12.6 14.3Z"/>
            </svg>
            All Reported Issues
          </h5>
        </div>
        <div className="card-body">
          {issues.length === 0 ? (
            <div className="text-center p-5">
              <h5>No Issues Reported Yet</h5>
              <p className="text-muted">Waiting for reports from parents & teachers</p>
            </div>
          ) : (
            <table className="table table-hover table-bordered">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Reported By</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {issues.map(issue => (
                  <tr>
                    <td><strong>#{issue.id}</strong></td>
                    <td>{issue.reportedBy}</td>
                    <td>{issue.description}</td>
                    <td><span className="badge bg-light text-dark">{issue.category}</span></td>
                    <td>{issue.location}</td>
                    <td>
                      <span className={`badge ${issue.priority === 'High' ? 'bg-danger' : issue.priority === 'Medium' ? 'bg-warning' : 'bg-success'}`}>
                        {issue.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${issue.status === 'Resolved' ? 'bg-success' : issue.status === 'In Progress' ? 'bg-info' : 'bg-warning'}`}>
                        {issue.status}
                      </span>
                    </td>
                    <td>
                      {issue.status === 'Pending' && (
                        <button className="btn btn-sm btn-info me-2" onClick={() => handleAssign(issue.id)}>
                          Assign Task
                        </button>
                      )}
                      {issue.status === 'In Progress' && (
                        <button className="btn btn-sm btn-success" onClick={() => handleResolve(issue.id)}>
                          Mark Resolved
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
