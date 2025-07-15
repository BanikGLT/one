import React from 'react';
import './GiftButton.css';

const GiftButton = ({ onClick, isLoading, disabled, totalGifts, isVisible }) => {
  return (
    <div className={`gift-button-container ${isVisible ? 'visible' : ''}`}>
      {/* Фоновая подсветка */}
      <div className="gift-button-glow"></div>
      
      {/* Основная кнопка */}
      <button
        className={`gift-button ${isLoading ? 'loading' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={onClick}
        disabled={disabled || isLoading}
      >
        {/* Анимированный фон */}
        <div className="button-bg">
          <div className="bg-gradient"></div>
          <div className="bg-pattern"></div>
        </div>
        
        {/* Иконка подарка */}
        <div className="gift-icon-wrapper">
          <div className="gift-icon">
            {isLoading ? (
              <svg className="loading-spinner" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="31.416" strokeDashoffset="31.416">
                  <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
                  <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
                </circle>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 12V22H4V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 7H22V12H2V7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 22V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 7H7.5C6.83696 7 6.20107 6.73661 5.73223 6.26777C5.26339 5.79893 5 5.16304 5 4.5C5 3.83696 5.26339 3.20107 5.73223 2.73223C6.20107 2.26339 6.83696 2 7.5 2C11 2 12 7 12 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 7H16.5C17.163 7 17.7989 6.73661 18.2678 6.26777C18.7366 5.79893 19 5.16304 19 4.5C19 3.83696 18.7366 3.20107 18.2678 2.73223C17.7989 2.26339 17.163 2 16.5 2C13 2 12 7 12 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
          <div className="icon-glow"></div>
        </div>
        
        {/* Текст кнопки */}
        <div className="button-content">
          <div className="button-text">
            {isLoading ? 'Добавляем...' : 'Добавить гифт'}
          </div>
          <div className="button-subtitle">
            {totalGifts === 0 ? 'Будь первым!' : `${totalGifts} участников`}
          </div>
        </div>
        
        {/* Эффект нажатия */}
        <div className="button-ripple"></div>
        
        {/* Дополнительные эффекты */}
        <div className="button-effects">
          <div className="effect-sparkle sparkle-1"></div>
          <div className="effect-sparkle sparkle-2"></div>
          <div className="effect-sparkle sparkle-3"></div>
        </div>
      </button>
      
      {/* Анимированные частицы */}
      <div className="gift-button-particles">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i} 
            className="particle"
            style={{ animationDelay: `${i * 0.2}s` }}
          ></div>
        ))}
      </div>
      
      {/* Информационная подсказка */}
      <div className="gift-button-info">
        <div className="info-icon">💡</div>
        <div className="info-text">
          Каждый гифт увеличивает твой шанс на джекпот!
        </div>
      </div>
    </div>
  );
};

export default GiftButton; 