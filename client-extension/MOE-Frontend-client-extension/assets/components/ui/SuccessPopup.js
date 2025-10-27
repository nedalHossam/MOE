import React from 'react';

const SuccessPopup = ({ 
  isVisible, 
  onClose, 
  image, 
  message, 
  showCloseButton = true 
}) => {
  if (!isVisible) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="success-popup-overlay" onClick={handleBackdropClick}>
      <div className="success-popup-container">
        <div className="success-popup-content">
          {image && (
            <div className="success-popup-icon">
              <img src={image} alt="Success" />
            </div>
          )}
          
          {message && (
            <div className="success-popup-message">
              {message}
            </div>
          )}
          
          {showCloseButton && (
            <button 
              className="success-popup-close-btn"
              onClick={onClose}
            >
              ×
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuccessPopup;
