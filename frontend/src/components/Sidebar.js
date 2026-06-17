import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaChartLine, FaUsers, FaUserShield, FaBuilding, FaTools, FaTruck, FaMoneyBill, FaBox, FaShieldAlt, FaExclamationTriangle, FaChartPie, FaBars, FaTimes } from 'react-icons/fa';

function Sidebar() {
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(true);

  const navStyle = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    minHeight: '100vh',
    padding: '1rem',
    position: 'sticky',
    top: '0',
    transition: 'all 0.3s ease'
  };

  const menuItems = [
    { path: '/dashboard', icon: <FaHome />, label: 'Dashboard' },
    { path: '/reports', icon: <FaChartLine />, label: 'Reports' },
    { path: '/user-management', icon: <FaUsers />, label: 'Users' },
    { path: '/staff-management', icon: <FaUserShield />, label: 'Staff' },
    { path: '/school-info', icon: <FaBuilding />, label: 'School Info' },
    { path: '/facility-list', icon: <FaBuilding />, label: 'Facilities' },
    { path: '/repair-schedule', icon: <FaTools />, label: 'Repair Schedule' },
    { path: '/vendor-list', icon: <FaTruck />, label: 'Vendors' },
    { path: '/budget-management', icon: <FaMoneyBill />, label: 'Budget' },
    { path: '/inventory', icon: <FaBox />, label: 'Inventory' },
    { path: '/safety-inspection', icon: <FaShieldAlt />, label: 'Safety' },
    { path: '/complaint-list', icon: <FaExclamationTriangle />, label: 'Complaints' },
    { path: '/analytics', icon: <FaChartPie />, label: 'Analytics' }
  ];

  return (
    <>
      <button 
        className="btn btn-outline-light d-md-none position-fixed"
        style={{ left: '10px', top: '10px', zIndex: 1001 }}
        onClick={() => setShowSidebar(!showSidebar)}
      >
        {showSidebar ? <FaTimes /> : <FaBars />}
      </button>

      <div style={{ 
        ...navStyle, 
        width: showSidebar ? '250px' : '0',
        marginLeft: showSidebar ? '0' : '-250px',
        overflow: 'hidden'
      }}>
        <h4 className="fw-bold mb-4 text-center">Admin Panel</h4>
        
        <div className="nav flex-column">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="nav-link text-white py-3 mb-1"
              style={{ 
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        <button 
          className="btn btn-outline-light w-100 mt-4"
          onClick={() => navigate('/')}
        >
          Back to Home
        </button>
      </div>
    </>
  );
}

export default Sidebar;
