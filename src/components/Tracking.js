import React from 'react';

function Tracking({ issues, user }) {
  const myIssues = user.role === 'admin' ? issues : issues.filter(i => i.schoolId === user.schoolId);

  return (
    <div>
      <h3 className="mb-4">Track Repair Status</h3>

      <div className="card shadow">
        <div className="card-header bg-info text-white">
          <h5>Issue Tracking Timeline</h5>
        </div>
        <div className="card-body">
          {myIssues.length === 0 ? (
            <p className="text-muted">No issues to track.</p>
          ) : (
            <div className="row">
              {myIssues.map(issue => (
                <div className="col-md-6 mb-4">
                  <div className="card border-primary">
                    <div className="card-header">
                      <h6>ID: {issue.id} - {issue.description}</h6>
                    </div>
                    <div className="card-body">
                      <p><strong>Category:</strong> {issue.category}</p>
                      <p><strong>Location:</strong> {issue.location}</p>
                      <p><strong>Status:</strong> 
                        <span className={`badge ${issue.status === 'Resolved' ? 'bg-success' : issue.status === 'In Progress' ? 'bg-info' : 'bg-warning'}`}>
                          {issue.status}
                        </span>
                      </p>
                      
                      <h6 className="mt-3">Timeline:</h6>
                      <ul className="list-group">
                        {issue.timeline.map((event, idx) => (
                          <li className="list-group-item list-group-item-secondary" key={idx}>
                            <small>{event.action}</small>
                            <br />
                            <small className="text-muted">{event.time}</small>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Tracking;
