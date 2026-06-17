import React from 'react';

function Dashboard({ issues, user }) {
  const myIssues = user.role === 'admin' ? issues : issues.filter(i => i.schoolId === user.schoolId);
  
  const pendingCount = myIssues.filter(i => i.status === 'Pending').length;
  const inProgressCount = myIssues.filter(i => i.status === 'In Progress').length;
  const resolvedCount = myIssues.filter(i => i.status === 'Resolved').length;
  const totalCount = myIssues.length;

  return (
    <div className="animate-fade-in">
      <div className="dashboard-hero">
        <h3>👋 Welcome, {user.name}!</h3>
        <p>{user.role === 'admin' ? 'Admin Dashboard - Manage All Issues' : `Track Your Reported Issues - School ID: ${user.schoolId}`}</p>
      </div>

      <div className="row mb-5">
        <div className="col-md-3 mb-4">
          <div className="stats-card">
            <h2>{totalCount}</h2>
            <h5>Total Issues</h5>
          </div>
        </div>
        <div className="col-md-3 mb-4">
          <div className="stats-card" style={{borderTop: '5px solid var(--warning-color)'}}>
            <h2 style={{color: 'var(--warning-color)'}}>{pendingCount}</h2>
            <h5>Pending</h5>
          </div>
        </div>
        <div className="col-md-3 mb-4">
          <div className="stats-card" style={{borderTop: '5px solid var(--accent-color)'}}>
            <h2 style={{color: 'var(--accent-color)'}}>{inProgressCount}</h2>
            <h5>In Progress</h5>
          </div>
        </div>
        <div className="col-md-3 mb-4">
          <div className="stats-card" style={{borderTop: '5px solid var(--success-color)'}}>
            <h2 style={{color: 'var(--success-color)'}}>{resolvedCount}</h2>
            <h5>Resolved</h5>
          </div>
        </div>
      </div>

      <div className="card shadow-lg animate-slide-in">
        <div className="card-header bg-primary text-white d-flex align-items-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white" style={{marginRight: '10px'}}>
            <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM16 18H8V16H16V18ZM16 14H8V12H16V14ZM16 10H8V8H16V10Z"/>
          </svg>
          <h5 className="m-0">All Reported Issues</h5>
        </div>
        <div className="card-body">
          {myIssues.length === 0 ? (
            <div className="empty-state">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"/>
              </svg>
              <h5>No Issues Reported Yet</h5>
              <p>Be the first to report a facility issue!</p>
            </div>
          ) : (
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Priority</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {myIssues.map(issue => (
                  <tr>
                    <td><strong>#{issue.id}</strong></td>
                    <td>{issue.description}</td>
                    <td>
                      <span className="badge bg-light text-dark">
                        {issue.category}
                      </span>
                    </td>
                    <td>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--primary-color)" style={{marginRight: '5px'}}>
                        <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.9 11.5 10 10.6 10 9.5C10 8.4 10.9 7.5 12 7.5C13.1 7.5 14 8.4 14 9.5C14 10.6 13.1 11.5 12 11.5Z"/>
                      </svg>
                      {issue.location}
                    </td>
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

export default Dashboard;
