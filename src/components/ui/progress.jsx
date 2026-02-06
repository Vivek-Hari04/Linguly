// src/components/ui/progress.jsx
import React from 'react';

const Progress = ({ value, label, ...props }) => {
  const clampedValue = Math.min(Math.max(value || 0, 0), 100);

  const containerStyle = {
    width: '100%'
  };

  const labelStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
    fontSize: '0.875rem',
    color: '#374151'
  };

  const barContainerStyle = {
    width: '100%',
    height: '0.5rem',
    backgroundColor: '#e5e7eb',
    borderRadius: '9999px',
    overflow: 'hidden'
  };

  const barFillStyle = {
    height: '100%',
    backgroundColor: '#2563eb',
    borderRadius: '9999px',
    transition: 'width 0.3s ease',
    width: `${clampedValue}%`
  };

  return (
    <div style={containerStyle} {...props}>
      {label && (
        <div style={labelStyle}>
          <span>{label}</span>
          <span>{clampedValue}%</span>
        </div>
      )}
      <div 
        style={barContainerStyle}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div style={barFillStyle} />
      </div>
    </div>
  );
};

export default Progress;