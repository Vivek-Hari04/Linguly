// src/components/ui/button.jsx
import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  disabled = false, 
  variant = 'primary',
  type = 'button',
  ...props 
}) => {
  const baseStyles = {
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    borderRadius: '0.375rem',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s',
    outline: 'none'
  };

  const variantStyles = {
    primary: {
      backgroundColor: disabled ? '#9ca3af' : '#2563eb',
      color: '#ffffff',
      ':hover': {
        backgroundColor: '#1d4ed8'
      }
    },
    secondary: {
      backgroundColor: disabled ? '#e5e7eb' : '#f3f4f6',
      color: disabled ? '#9ca3af' : '#374151',
      ':hover': {
        backgroundColor: '#e5e7eb'
      }
    },
    ghost: {
      backgroundColor: 'transparent',
      color: disabled ? '#9ca3af' : '#374151',
      ':hover': {
        backgroundColor: '#f3f4f6'
      }
    }
  };

  const [isHovered, setIsHovered] = React.useState(false);

  const style = {
    ...baseStyles,
    ...variantStyles[variant],
    ...(isHovered && !disabled && variant === 'primary' && { backgroundColor: '#1d4ed8' }),
    ...(isHovered && !disabled && variant === 'secondary' && { backgroundColor: '#e5e7eb' }),
    ...(isHovered && !disabled && variant === 'ghost' && { backgroundColor: '#f3f4f6' })
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;