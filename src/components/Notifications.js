import React from 'react';

function Notifications({ notifications, user }) {

  return (
    <div>
      <h3 className="mb-4">Notifications</h3>

      <div className="card shadow">
        <div className="card-header bg-success text-white">
          <h5>Recent Updates</h5>
        </div>
        <div className="card-body">
          {notifications.length === 0 ? (
            <p className="text-muted">No notifications yet.</p>
          ) : (
            <ul className="list-group">
              {notifications.map((notif, idx) => (
                <li className="list-group-item list-group-item-success" key={idx}>
                  <p className="mb-1">{notif.message}</p>
                  <small className="text-muted">{notif.time}</small>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notifications;
