import React from 'react';
import './TopBar.css';

const TopBar = ({ totalGifts, totalAmount, isRunning, timer, isVisible }) => {
  return (
    <div className={`topbar-container ${isVisible ? 'visible' : ''}`}>
      {/* Фоновая подсветка */}
      <div className="topbar-glow"></div>
      
      {/* Основной контейнер */}
      <div className="topbar-main">
        {/* Левая секция - Участники */}
        <div className="topbar-section participants-section">
          <div className="topbar-icon-wrapper">
            <div className="topbar-icon participants-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className="topbar-info">
            <div className="topbar-label">Участники</div>
            <div className="topbar-value">{totalGifts}</div>
          </div>
        </div>

        {/* Центральная секция - Джекпот */}
        <div className="topbar-section jackpot-section">
          <div className="topbar-icon-wrapper">
            <div className="topbar-icon jackpot-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 3L19.5 5.5L22 6L19.5 6.5L19 9L18.5 6.5L16 6L18.5 5.5L19 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 3L5.5 5.5L8 6L5.5 6.5L5 9L4.5 6.5L2 6L4.5 5.5L5 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
          </div>
          </div>
          <div className="topbar-info">
            <div className="topbar-label">Джекпот</div>
            <div className="topbar-value jackpot-value">{totalAmount.toFixed(2)} TON</div>
          </div>
        </div>

        {/* Правая секция - Статус */}
        <div className="topbar-section status-section">
          <div className="topbar-icon-wrapper">
            <div className={`topbar-icon status-icon ${isRunning ? 'running' : 'waiting'}`}>
              {isRunning ? (
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 18V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4.93 4.93L7.76 7.76" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16.24 16.24L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4.93 19.07L7.76 16.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16.24 7.76L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
          </div>
          <div className="topbar-info">
            <div className="topbar-label">Статус</div>
            <div className="topbar-value status-value">
              {isRunning ? 'Игра идет' : 'Ожидание'}
            </div>
          </div>
        </div>
      </div>

      {/* Анимированные частицы */}
      <div className="topbar-particles">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className="particle"
            style={{ animationDelay: `${i * 0.3}s` }}
          ></div>
        ))}
      </div>

      {/* Дополнительные эффекты */}
      <div className="topbar-effects">
        <div className="effect-line line-1"></div>
        <div className="effect-line line-2"></div>
      </div>
    </div>
  );
};

export default TopBar; 