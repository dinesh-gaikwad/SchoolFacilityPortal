import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaList, FaSearch, FaFilter, FaCheckCircle, FaClock, FaExclamationCircle } from 'react-icons/fa';

function IssueTracking() {
  const [issues, setIssues] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load issues from localStorage (replace with API call)
    const storedIssues = JSON.parse(localStorage.getItem('issues') || '[]');
    const sampleIssues = [
      {
        id: 1,
        description: 'Broken classroom chair',
        category: 'Furniture',
        location: 'Room 101',
        status: 'Pending',
        priority: 'Medium',
        reportedBy: 'John Doe',
        reportedDate: '2026-06-15',
        timeline: [{ action: 'Issue Reported', time: '2026-06-15 10:30 AM' }]
      },
      {
        id: 2,
        description: 'Leaking toilet',
        category: 'Plumbing',
        location: 'Toilet Block A',
        status: 'In Progress',
        priority: 'High',
        reportedBy: 'Jane Smith',
        reportedDate: '2026-06-14',
        timeline: [
          { action: 'Issue Reported', time: '2026-06-14 09:15 AM' },
          { action: 'Status updated to In Progress', time: '2026-06-15 02:00 PM' }
        ]
      },
      {
        id: 3,
        description: 'Flickering light',
        category: 'Electrical',
        location: 'Library',
        status: 'Resolved',
        priority: 'Low',
        reportedBy: 'Mike Johnson',
        reportedDate: '2026-06-10',
        timeline: [
          { action: 'Issue Reported', time: '2026-06-10 11:00 AM' },
          { action: 'Status updated to In Progress', time: '2026-06-11 09:00 AM' },
          { action: 'Status updated to Resolved', time: '2026-06-12 04:30 PM' }
        ]
      },
      {
        id: 4,
        description: 'Damaged door handle',
        category: 'Furniture',
        location: 'Main Entrance',
        status: 'Pending',
        priority: 'Medium',
        reportedBy: 'Sarah Wilson',
        reportedDate: '2026-06-16',
        timeline: [{ action: 'Issue Reported', time: '2026-06-16 08:45 AM' }]
      },
      {
        id: 5,
        description: 'Cracked window glass',
        category: 'Classroom',
        location: 'Room 202',
        status: 'Pending',
        priority: 'Critical',
        reportedBy: 'Tom Brown',
        reportedDate: '2026-06-17',
        timeline: [{ action: 'Issue Reported', time: '2026-06-17 07:20 AM' }]
      }
    ];

    setIssues([...sampleIssues, ...storedIssues]);
  }, []);

  const getStatusBadge = (status) => {
    const badges = {
      'Pending': 'status-pending',
      'In Progress': 'status-inprogress',
      'Resolved': 'status-resolved'
    };
    return badges[status] || 'status-pending';
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      'Low': 'bg-success',
      'Medium': 'bg-info',
      'High': 'bg-warning',
      'Critical': 'bg-danger'
    };
    return colors[priority] || 'bg-info';
  };

  const filteredIssues = issues.filter(issue => {
    const matchesStatus = filterStatus === 'All' || issue.status === filterStatus;
    const matchesPriority = filterPriority === 'All' || issue.priority === filterPriority;
    const matchesSearch = issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.id.toString().includes(searchTerm);
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const stats = {
    total: issues.length,
    pending: issues.filter(i => i.status === 'Pending').length,
    inProgress: issues.filter(i => i.status === 'In Progress').length,
    resolved: issues.filter(i => i.status === 'Resolved').length
  };

  return (
    <div className="py-5">
      <div className="container">
        <div className="row mb-4">
          <div className="col-12">
            <h2 className="display-5">
              <FaList className="me-3" /> Track All Issues
            </h2>
            <p className="text-muted">Monitor repair status and progress</p>
          </div>
        </div>

        {/* Stats */}
        <div className="row mb-4">
          <div className="col-md-3 mb-2">
            <div className="stat-card">
              <h3>{stats.total}</h3>
              <p>Total Issues</p>
            </div>
          </div>
          <div className="col-md-3 mb-2">
            <div className="stat-card">
              <FaClock className="mb-2" style={{ fontSize: '1.5rem', color: '#ffc107' }} />
              <h3>{stats.pending}</h3>
              <p>Pending</p>
            </div>
          </div>
          <div className="col-md-3 mb-2">
            <div className="stat-card">
              <FaExclamationCircle className="mb-2" style={{ fontSize: '1.5rem', color: '#0d6efd' }} />
              <h3>{stats.inProgress}</h3>
              <p>In Progress</p>
            </div>
          </div>
          <div className="col-md-3 mb-2">
            <div className="stat-card">
              <FaCheckCircle className="mb-2" style={{ fontSize: '1.5rem', color: '#198754' }} />
              <h3>{stats.resolved}</h3>
              <p>Resolved</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="row mb-4">
          <div className="col-md-4 mb-2">
            <label className="form-label"><FaSearch className="me-2" /> Search</label>
            <input
              type="text"
              className="form-control"
              placeholder="Search by ID or description"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-md-3 mb-2">
            <label className="form-label"><FaFilter className="me-2" /> Filter by Status</label>
            <select
              className="form-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
          <div className="col-md-3 mb-2">
            <label className="form-label"><FaFilter className="me-2" /> Filter by Priority</label>
            <select
              className="form-select"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="All">All Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
          <div className="col-md-2 mb-2">
            <label className="form-label">&nbsp;</label>
            <button
              className="btn btn-custom w-100"
              onClick={() => {
                setFilterStatus('All');
                setFilterPriority('All');
                setSearchTerm('');
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Issues Table */}
        <div className="row">
          <div className="col-12">
            <div className="table-custom">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Reported By</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIssues.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="text-center">
                        <div className="py-4">
                          <FaList className="mb-2" style={{ fontSize: '2rem', color: '#ccc' }} />
                          <p className="text-muted">No issues found</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredIssues.map((issue) => (
                      <tr>
                        <td><strong>#{issue.id}</strong></td>
                        <td>{issue.description}</td>
                        <td>{issue.category}</td>
                        <td>{issue.location}</td>
                        <td><span className={`badge ${getPriorityBadge(issue.priority)}`}>{issue.priority}</span></td>
                        <td><span className={getStatusBadge(issue.status)}>{issue.status}</span></td>
                        <td>{issue.reportedBy}</td>
                        <td>{issue.reportedDate}</td>
                        <td>
                          <Link to={`/issue/${issue.id}`} className="btn btn-sm btn-primary">
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-12">
            <p className="text-muted">Showing {filteredIssues.length} of {issues.length} issues</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IssueTracking;
