import React, { useState, useEffect } from 'react';
import { FaCog, FaBell, FaLock, FaEye, FaEnvelope, FaMobile, FaCheckCircle } from 'react-icons/fa';

function Settings() {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    issueUpdates: true,
    resolvedNotifications: true,
    priorityAlerts: true,
    darkMode: false,
    language: 'en'
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    const storedSettings = localStorage.getItem('settings');
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    }
  }, []);

  const handleToggle = (key) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    localStorage.setItem('settings', JSON.stringify(newSettings));
  };

  const handleSelect = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('settings', JSON.stringify(newSettings));
  };

  if (!user) {
    return (
      <div className="py-5 text-center">
        <div className="alert alert-warning">Please login to access settings</div>
        <button onClick={() => window.location.href = '/login'} className="btn btn-custom">Go to Login</button>
      </div>
    );
  }

  return (
    <div className="py-5">
      <div className="container">
        <div className="row mb-4">
          <div className="col-12">
            <h2 className="display-5"><FaCog className="me-3" /> Settings</h2>
            <p className="text-muted">Manage your preferences and notification settings</p>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card-custom">
              <div className="card-header">
                <h5 className="mb-0"><FaBell className="me-2" /> Notification Preferences</h5>
              </div>
              <div className="card-body">
                <div className="form-check mb-3">
                  <input type="checkbox" className="form-check-input" id="emailNotif" checked={settings.emailNotifications} onChange={() => handleToggle('emailNotifications')} />
                  <label className="form-check-label" htmlFor="emailNotif">
                    <FaEnvelope className="me-2" /> Email Notifications
                  </label>
                  <small className="text-muted d-block">Receive updates via email</small>
                </div>
                <div className="form-check mb-3">
                  <input type="checkbox" className="form-check-input" id="smsNotif" checked={settings.smsNotifications} onChange={() => handleToggle('smsNotifications')} />
                  <label className="form-check-label" htmlFor="smsNotif">
                    <FaMobile className="me-2" /> SMS Notifications
                  </label>
                  <small className="text-muted d-block">Receive updates via SMS</small>
                </div>
                <div className="form-check mb-3">
                  <input type="checkbox" className="form-check-input" id="issueUpdates" checked={settings.issueUpdates} onChange={() => handleToggle('issueUpdates')} />
                  <label className="form-check-label" htmlFor="issueUpdates">
                    <FaCheckCircle className="me-2" /> Issue Status Updates
                  </label>
                  <small className="text-muted d-block">Get notified when issue status changes</small>
                </div>
                <div className="form-check mb-3">
                  <input type="checkbox" className="form-check-input" id="resolvedNotif" checked={settings.resolvedNotifications} onChange={() => handleToggle('resolvedNotifications')} />
                  <label className="form-check-label" htmlFor="resolvedNotif">
                    <FaCheckCircle className="me-2" /> Resolved Issue Notifications
                  </label>
                  <small className="text-muted d-block">Get notified when issues are resolved</small>
                </div>
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="priorityAlerts" checked={settings.priorityAlerts} onChange={() => handleToggle('priorityAlerts')} />
                  <label className="form-check-label" htmlFor="priorityAlerts">
                    <FaBell className="me-2" /> Priority Alerts
                  </label>
                  <small className="text-muted d-block">Immediate alerts for critical/high priority issues</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* General Settings */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card-custom">
              <div className="card-header">
                <h5 className="mb-0"><FaCog className="me-2" /> General Settings</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label"><FaEye className="me-2" /> Theme</label>
                  <select className="form-select" value={settings.darkMode ? 'dark' : 'light'} onChange={(e) => handleToggle('darkMode')}>
                    <option value="light">Light Mode</option>
                    <option value="dark">Dark Mode</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Language</label>
                  <select className="form-select" value={settings.language} onChange={(e) => handleSelect('language', e.target.value)}>
                    <option value="en">English</option>
                    <option value="mr">Marathi</option>
                    <option value="hi">Hindi</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="row">
          <div className="col-12">
            <div className="card-custom">
              <div className="card-header">
                <h5 className="mb-0"><FaLock className="me-2" /> Security Settings</h5>
              </div>
              <div className="card-body">
                <button className="btn btn-outline-primary mb-2">
                  <FaLock className="me-2" /> Change Password
                </button>
                <button className="btn btn-outline-danger">
                  <FaLock className="me-2" /> Enable Two-Factor Authentication
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
