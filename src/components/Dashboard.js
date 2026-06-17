import React from 'react';

function Dashboard({ issues, user }) {
  const myIssues = user.role === 'admin' ? issues : issues.filter(i => i.schoolId === user.schoolId);
  
  const pendingCount = myIssues.filter(i => i.status === 'Pending').length;
  const inProgressCount = myIssues.filter(i => i.status === 'In Progress').length;
  const resolvedCount = myIssues.filter(i => i.status === 'Resolved').length;

  return (
    <div>
      <h3 className="mb-4">Dashboard - {user.role === 'admin' ? 'Admin View' : `${user.name}'s Issues`}</h3>
      
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-center shadow">
            <div className="card-header bg-warning text-dark">
              <h5>Pending</h5>
            </div>
            <div className="card-body">
              <h2>{pendingCount}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center shadow">
            <div className="card-header bg-info text-dark">
              <h5>In Progress</h5>
            </div>
            <div className="card-body">
              <h2>{inProgressCount}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center shadow">
            <div className="card-header bg-success text-white">
              <h5>Resolved</h5>
            </div>
            <div className="card-body">
              <h2>{resolvedCount}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h5>All Reported Issues</h5>
        </div>
        <div className="card-body">
          {myIssues.length === 0 ? (
            <p className="text-muted">No issues reported yet.</p>
          ) : (
            <table className="table table-striped table-hover">
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
                    <td>{issue.id}</td>
                    <td>{issue.description}</td>
                    <td>{issue.category}</td>
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
