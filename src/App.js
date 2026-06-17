import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import IssueReport from './components/IssueReport';
import Tracking from './components/Tracking';
import Notifications from './components/Notifications';
import AdminPanel from './components/AdminPanel';

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('login');
  const [issues, setIssues] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const handleLogin = (userData) => {
    setUser(userData);
    setPage(userData.role === 'admin' ? 'admin' : 'dashboard');
  };

  const handleReportIssue = (issue) => {
    const newIssue = {
      ...issue,
      id: Date.now(),
      status: 'Pending',
      timeline: [{ action: 'Issue Reported', time: new Date().toLocaleString() }]
    };
    setIssues([...issues, newIssue]);
    setNotifications([...notifications, { message: `New issue reported: ${issue.description}`, time: new Date().toLocaleString() }]);
    setPage('dashboard');
  };

  const handleUpdateStatus = (id, newStatus) => {
    setIssues(issues.map(i => i.id === id ? {
      ...i,
      status: newStatus,
      timeline: [...i.timeline, { action: `Status updated to ${newStatus}`, time: new Date().toLocaleString() }]
    } : i));
    setNotifications([...notifications, { message: `Issue #${id} status updated to ${newStatus}`, time: new Date().toLocaleString() }]);
  };

  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-3">
        <a className="navbar-brand" href="#">School Facility Portal</a>
        {user && (
          <div className="ms-auto">
            <button className="btn btn-sm btn-light me-2" onClick={() => setPage('dashboard')}>Dashboard</button>
            <button className="btn btn-sm btn-light me-2" onClick={() => setPage('report')}>Report Issue</button>
            <button className="btn btn-sm btn-light me-2" onClick={() => setPage('tracking')}>Track</button>
            <button className="btn btn-sm btn-light me-2" onClick={() => setPage('notifications')}>Notifications</button>
            {user.role === 'admin' && <button className="btn btn-sm btn-warning" onClick={() => setPage('admin')}>Admin</button>}
            <button className="btn btn-sm btn-danger" onClick={() => { setUser(null); setPage('login'); }}>Logout</button>
          </div>
        )}
      </nav>

      <div className="container mt-4">
        {page === 'login' && <Login onLogin={handleLogin} />}
        {page === 'dashboard' && <Dashboard issues={issues} user={user} />}
        {page === 'report' && <IssueReport onReport={handleReportIssue} user={user} />}
        {page === 'tracking' && <Tracking issues={issues} user={user} />}
        {page === 'notifications' && <Notifications notifications={notifications} user={user} />}
        {page === 'admin' && <AdminPanel issues={issues} onUpdateStatus={handleUpdateStatus} user={user} />}
      </div>
    </div>
  );
}

export default App;
