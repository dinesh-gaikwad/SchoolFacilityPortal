import React from 'react';

function Card({ 
  title, 
  children, 
  icon, 
  variant = 'primary', 
  onClick,
  className = ''
}) {
  const cardStyle = {
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: onClick ? 'pointer' : 'default'
  };

  const headerStyle = {
    background: variant === 'primary' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 
                variant === 'success' ? 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)' :
                variant === 'danger' ? 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)' :
                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '1rem',
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
  };

  const bodyStyle = {
    padding: '1.5rem'
  };

  return (
    <div 
      style={cardStyle}
      className={`card-custom ${className}`}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 12px rgba(0, 0, 0, 0.15)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        }
      }}
    >
      {title && (
        <div style={headerStyle}>
          <h5 className="mb-0 d-flex align-items-center gap-2">
            {icon && <span>{icon}</span>}
            {title}
          </h5>
        </div>
      )}
      <div style={bodyStyle}>
        {children}
      </div>
    </div>
  );
}

export default Card;
