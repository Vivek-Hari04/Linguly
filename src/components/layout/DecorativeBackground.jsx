// src/components/layout/DecorativeBackground.jsx
import React from 'react';

const DecorativeBackground = ({ children }) => {
  const containerStyle = {
    position: 'relative',
    minHeight: '100vh',
    overflow: 'hidden'
  };

  const backgroundStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    opacity: 0.05,
    pointerEvents: 'none'
  };

  const shape1Style = {
    position: 'fixed',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
    top: '-200px',
    left: '-200px',
    zIndex: -1,
    pointerEvents: 'none'
  };

  const shape2Style = {
    position: 'fixed',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(118, 75, 162, 0.08) 0%, transparent 70%)',
    bottom: '-150px',
    right: '-150px',
    zIndex: -1,
    pointerEvents: 'none'
  };

  const shape3Style = {
    position: 'fixed',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(102, 126, 234, 0.06) 0%, transparent 70%)',
    top: '50%',
    right: '10%',
    transform: 'translateY(-50%)',
    zIndex: -1,
    pointerEvents: 'none'
  };

  return (
    <div style={containerStyle}>
      <div style={backgroundStyle} />
      <div style={shape1Style} />
      <div style={shape2Style} />
      <div style={shape3Style} />
      {children}
    </div>
  );
};

export default DecorativeBackground;