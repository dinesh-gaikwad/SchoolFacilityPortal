import React from 'react';

function Tracking({ issues, user }) {
  const myIssues = user.role === 'admin' ? issues : issues.filter(i => i.schoolId === user.schoolId);

  return (
    <div className="animate-fade-in">
      <div className="dashboard-hero bg-info" style={{background: 'linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)'}}>
        <h3>🔍 Track Repair Status</h3>
        <p>Real-time update on all reported facility issues</p>
      </div>

      <div className="row">
        {myIssues.length === 0 ? (
          <div className="col-12">
            <div className="card shadow-lg">
              <div className="card-body text-center p-6">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="var(--gray-500)">
                  <path d="M13 3C8.14 3 4 7.14 4 12S8.14 21 13 21S22 16.86 22 12S17.86 3 13 3ZM12.5 19C10.76 19 9.18 18.03 8.5 16.5L10.23 15.77C10.67 16.64 11.53 17.25 12.5 17.25C13.88 17.25 15.25 16.14 15.25 14.5C15.25 12.98 13.63 12.25 12.5 11.75C11.19 11.14 10.25 10.5 10.25 9C10.25 7.94 11.25 7 12.5 7C14.24 7 15.82 7.97 16.5 9.5L14.77 10.23C14.33 9.36 13.47 8.75 12.5 8.75C11.12 8.75 10.25 9.59 10.25 10.5C10.25 11.57 11.87 12.3 13 12.75C14.31 13.36 15.25 14 15.25 15.5C15.25 17.55 13.76 19 12.5 19Z"/>
                </svg>
                <h5 className="mt-3">No Issues to Track</h5>
                <p className="text-muted">Report an issue to start tracking!</p>
              </div>
            </div>
          </div>
        ) : (
          myIssues.map((issue, idx) => (
            <div className="col-md-6 mb-4 animate-slide-in" style={{animationDelay: `${idx * 0.1}s`}}>
              <div className="card border-primary shadow-lg">
                <div className="card-header bg-primary text-white">
                  <h6 className="m-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white" style={{marginRight: '8px'}}>
                      <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z"/>
                    </svg>
                    Issue #{issue.id} - {issue.description}
                  </h6>
                </div>
                <div className="card-body">
                  <div className="row mb-3">
                    <div className="col-6">
                      <small className="text-muted">Category</small>
                      <h5 className="mb-0">{issue.category}</h5>
                    </div>
                    <div className="col-6">
                      <small className="text-muted">Location</small>
                      <h5 className="mb-0">{issue.location}</h5>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <small className="text-muted">Status</small>
                    <span className={`badge ${issue.status === 'Resolved' ? 'bg-success' : issue.status === 'In Progress' ? 'bg-info' : 'bg-warning'} fs-6`}>
                      {issue.status}
                    </span>
                  </div>

                  <div className="mb-3">
                    <small className="text-muted">Priority</small>
                    <span className={`badge ${issue.priority === 'High' ? 'bg-danger' : issue.priority === 'Medium' ? 'bg-warning' : 'bg-success'} fs-6`}>
                      {issue.priority}
                    </span>
                  </div>
                  
                  <h6 className="mt-4 mb-3">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--primary-color)" style={{marginRight: '5px'}}>
                      <path d="M11.99 2C6.47 2 2 6.48 2 12S6.47 22 11.99 22S22 17.52 22 12S17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12S7.58 4 12 4S20 7.58 20 12S16.42 20 12 20Z"/>
                      <path d="M12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z"/>
                    </svg>
                    Timeline
                  </h6>
                  <ul className="list-group">
                    {issue.timeline.map((event, idx) => (
                      <li className="list-group-item" key={idx}>
                        <strong>{event.action}</strong>
                        <br />
                        <small className="text-muted">{event.time}</small>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Tracking;
