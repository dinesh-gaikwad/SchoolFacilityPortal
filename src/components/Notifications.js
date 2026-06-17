import React from 'react';

function Notifications({ notifications, user }) {
  return (
    <div className="animate-fade-in">
      <div className="dashboard-hero bg-success" style={{background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'}}>
        <h3>🔔 Notifications</h3>
        <p>Stay updated with latest issue resolution progress</p>
      </div>

      <div className="card shadow-lg">
        <div className="card-header bg-success text-white">
          <h5 className="m-0">Recent Updates</h5>
        </div>
        <div className="card-body">
          {notifications.length === 0 ? (
            <div className="text-center p-5">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="var(--gray-500)">
                <path d="M12 22C13.1 22 14 21.1 14 20V17H10V20C10 21.1 10.9 22 12 22ZM18.8 16.6L18.3 14.3C18.7 13.4 19 12.5 19 11.5C19 7.4 15.6 4 11.5 4S4 7.4 4 11.5C4 13.9 5.4 16.1 7.4 17.2L7.8 19.9C7.9 20.5 8.4 21 9 21H15C15.6 21 16.1 20.5 16.2 19.9L16.6 17.6L18.8 18.1C18.9 18.1 19 18.1 19.1 18.1C19.6 18.1 20 17.8 20.2 17.3C20.4 16.7 20.1 16.1 19.6 15.9L18.8 16.6ZM11.5 17C8.5 17 6 14.5 6 11.5S8.5 7 11.5 7S17 9.5 17 12.5S14.5 17 11.5 17Z"/>
              </svg>
              <h5 className="mt-3">No Notifications Yet</h5>
              <p className="text-muted">You'll receive updates when issues are resolved!</p>
            </div>
          ) : (
            notifications.map((notif, idx) => (
              <div className="notification-item" key={idx}>
                <div className="d-flex align-items-start">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--success-color)" style={{marginRight: '15px'}}>
                    <path d="M9 16.2L4.8 12L6.2 10.6L9 13.4L17.8 4.6L19.2 6L9 16.2Z"/>
                  </svg>
                  <div>
                    <p className="mb-1 fw-semibold">{notif.message}</p>
                    <small className="text-muted">{notif.time}</small>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Notifications;
