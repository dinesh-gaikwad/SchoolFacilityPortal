import React from 'react';

function AdminPanel({ issues, onUpdateStatus, user }) {
  if (user.role !== 'admin') {
    return <div className="alert alert-danger">Access denied. Admin only.</div>;
  }

  const handleAssign = (id) => {
    onUpdateStatus(id, 'In Progress');
  };

  const handleResolve = (id) => {
    onUpdateStatus(id, 'Resolved');
  };

  return (
    <div>
      <h3 className="mb-4">Admin Panel - Manage Issues</h3>

      <div className="card shadow">
        <div className="card-header bg-warning text-dark">
          <h5>All Reported Issues</h5>
        </div>
        <div className="card-body">
          {issues.length === 0 ? (
            <p className="text-muted">No issues reported yet.</p>
          ) : (
            <table className="table table-bordered">
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
                    <td>{issue.id}</td>
                    <td>{issue.reportedBy}</td>
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
                    <td>
                      {issue.status === 'Pending' && (
                        <button className="btn btn-sm btn-info me-2" onClick={() => handleAssign(issue.id)}>Assign</button>
                      )}
                      {issue.status === 'In Progress' && (
                        <button className="btn btn-sm btn-success" onClick={() => handleResolve(issue.id)}>Resolve</button>
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
