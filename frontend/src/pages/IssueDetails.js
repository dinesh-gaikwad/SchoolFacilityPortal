import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaExclamationCircle, FaClock, FaUser, FaLocationArrow, FaTag, FaCheckCircle, FaList } from 'react-icons/fa';

function IssueDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);

  useEffect(() => {
    const allIssues = JSON.parse(localStorage.getItem('issues') || '[]');
    const sampleIssues = [
      { id: 1, description: 'Broken classroom chair', category: 'Furniture', location: 'Room 101', status: 'Pending', priority: 'Medium', reportedBy: 'John Doe', reportedDate: '2026-06-15', timeline: [{ action: 'Issue Reported', time: '2026-06-15 10:30 AM' }] },
      { id: 2, description: 'Leaking toilet', category: 'Plumbing', location: 'Toilet Block A', status: 'In Progress', priority: 'High', reportedBy: 'Jane Smith', reportedDate: '2026-06-14', timeline: [{ action: 'Issue Reported', time: '2026-06-14 09:15 AM' }, { action: 'Status updated to In Progress', time: '2026-06-15 02:00 PM' }] },
      { id: 3, description: 'Flickering light', category: 'Electrical', location: 'Library', status: 'Resolved', priority: 'Low', reportedBy: 'Mike Johnson', reportedDate: '2026-06-10', timeline: [{ action: 'Issue Reported', time: '2026-06-10 11:00 AM' }, { action: 'Resolved', time: '2026-06-12 04:30 PM' }] }
    ];
    const foundIssue = allIssues.find(i => i.id === Number(id)) || sampleIssues.find(i => i.id === Number(id));
    setIssue(foundIssue);
  }, [id]);

  const getStatusBadge = (status) => {
    const badges = { 'Pending': 'status-pending', 'In Progress': 'status-inprogress', 'Resolved': 'status-resolved' };
    return badges[status] || 'status-pending';
  };

  const getPriorityBadge = (priority) => {
    const colors = { 'Low': 'bg-success', 'Medium': 'bg-info', 'High': 'bg-warning', 'Critical': 'bg-danger' };
    return colors[priority] || 'bg-info';
  };

  if (!issue) {
    return (
      <div className="py-5 text-center">
        <div className="alert alert-warning">Issue not found</div>
        <Link to="/track-issues" className="btn btn-custom">View All Issues</Link>
      </div>
    );
  }

  return (
    <div className="py-5">
      <div className="container">
        <div className="row mb-4">
          <div className="col-12">
            <Link to="/track-issues" className="btn btn-outline-primary mb-3">
              <FaList className="me-2" /> Back to Issues
            </Link>
          </div>
        </div>

        <div className="row">
          <div className="col-md-8">
            <div className="card-custom">
              <div className="card-header">
                <h3><FaExclamationCircle className="me-2" /> Issue #{issue.id}</h3>
              </div>
              <div className="card-body p-4">
                <h4 className="mb-3">{issue.description}</h4>
                <div className="row mb-3">
                  <div className="col-md-6 mb-2">
                    <strong><FaTag className="me-2" /> Category:</strong> {issue.category}
                  </div>
                  <div className="col-md-6 mb-2">
                    <strong><FaLocationArrow className="me-2" /> Location:</strong> {issue.location}
                  </div>
                  <div className="col-md-6 mb-2">
                    <strong><FaClock className="me-2" /> Reported:</strong> {issue.reportedDate}
                  </div>
                  <div className="col-md-6 mb-2">
                    <strong><FaUser className="me-2" /> Reported By:</strong> {issue.reportedBy}
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <span className={`badge ${getPriorityBadge(issue.priority)} fs-5`}>{issue.priority} Priority</span>
                  </div>
                  <div className="col-md-6">
                    <span className={getStatusBadge(issue.status)}>{issue.status}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="card-custom mt-4">
              <div className="card-header">
                <h5 className="mb-0"><FaClock className="me-2" /> Activity Timeline</h5>
              </div>
              <div className="card-body p-4">
                {issue.timeline.map((event, index) => (
                  <div className="d-flex mb-3" key={index}>
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mr-3" style={{width: '30px', height: '30px'}}>
                      <FaCheckCircle size={14} />
                    </div>
                    <div>
                      <p className="mb-1">{event.action}</p>
                      <small className="text-muted">{event.time}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card-custom">
              <div className="card-header">
                <h5 className="mb-0">Issue Summary</h5>
              </div>
              <div className="card-body p-4">
                <div className="mb-3">
                  <strong>Status:</strong>
                  <span className={getStatusBadge(issue.status)} className="ms-2">{issue.status}</span>
                </div>
                <div className="mb-3">
                  <strong>Priority:</strong>
                  <span className={`badge ${getPriorityBadge(issue.priority)} ms-2`}>{issue.priority}</span>
                </div>
                <button className="btn btn-custom w-100 mt-3" onClick={() => navigate('/report-issue')}>
                  Report New Issue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IssueDetails;
