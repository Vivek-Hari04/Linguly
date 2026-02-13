// src/components/ui/modal.jsx
import React, { useEffect } from 'react';

const Modal = ({ open, onClose, title, children }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open, onClose]);

  if (!open) return null;

  const backdropStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem'
  };

  const modalStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '0.5rem',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    maxWidth: '32rem',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    position: 'relative'
  };

  const headerStyle = {
    padding: '1.5rem',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  const titleStyle = {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#111827',
    margin: 0
  };

  const closeButtonStyle = {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#6b7280',
    padding: '0.25rem',
    lineHeight: 1
  };

  const contentStyle = {
    padding: '1.5rem'
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div style={backdropStyle} onClick={handleBackdropClick}>
      <div style={modalStyle} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div style={headerStyle}>
          <h2 id="modal-title" style={titleStyle}>{title}</h2>
          <button
            onClick={onClose}
            style={closeButtonStyle}
            aria-label="Close modal"
            type="button"
          >
            ×
          </button>
        </div>
        <div style={contentStyle}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;