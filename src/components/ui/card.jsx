// src/components/ui/card.jsx
import React from 'react';

const Card = ({ children, className = '', ...props }) => {
  const style = {
    backgroundColor: '#ffffff',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    padding: '1.5rem',
    border: '1px solid #e5e7eb'
  };

  return (
    <div style={style} className={className} {...props}>
      {children}
    </div>
  );
};

export default Card;