// src/components/ui/badge.jsx
import React from 'react';

const Badge = ({ text, variant = 'default', ...props }) => {
  const variantStyles = {
    default: {
      backgroundColor: '#e5e7eb',
      color: '#374151'
    },
    success: {
      backgroundColor: '#d1fae5',
      color: '#065f46'
    },
    warning: {
      backgroundColor: '#fef3c7',
      color: '#92400e'
    },
    danger: {
      backgroundColor: '#fee2e2',
      color: '#991b1b'
    }
  };

  const style = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.25rem 0.75rem',
    fontSize: '0.75rem',
    fontWeight: '500',
    borderRadius: '9999px',
    ...variantStyles[variant]
  };

  return (
    <span style={style} {...props}>
      {text}
    </span>
  );
};

export default Badge;