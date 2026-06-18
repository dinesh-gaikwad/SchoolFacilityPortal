import React from 'react';
function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return (
    <div className="container mt-4">
      <h2>Dashboard</h2>
      {user.name && <p>Welcome, {user.name}</p>}
    </div>
  );
}
export default Dashboard;
