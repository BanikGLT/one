import React from 'react';
import './GiftButton.css';

const GiftButton = ({ onClick, isLoading, disabled, totalGifts }) => {
  return (
    <div className="gift-button-container">
      <button
        className={`gift-button ${isLoading ? 'loading' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={onClick}
        disabled={disabled || isLoading}
      >
        {isLoading ? (
          <div className="gift-button-loading">
            <div className="loading-spinner"></div>
            <span>Добавление...</span>
          </div>
        ) : (
          <div className="gift-button-content">
            <div className="gift-button-icon">🎁</div>
            <div className="gift-button-text">
              <div className="gift-button-title">Добавить гифт</div>
              <div className="gift-button-subtitle">{totalGifts} гифтов</div>
            </div>
          </div>
        )}
      </button>
    </div>
  );
};

export default GiftButton; 