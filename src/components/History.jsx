import React from 'react';
import './History.css';

const History = ({ history, isVisible }) => {
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getTimeAgo = () => {
    const now = new Date();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`history-container ${isVisible ? 'visible' : ''}`}>
      {/* Фоновая подсветка */}
      <div className="history-glow"></div>
      
      {/* Основной контейнер */}
      <div className="history-main">
        {/* Заголовок */}
        <div className="history-header">
          <div className="history-icon-wrapper">
            <div className="history-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className="history-title">
            <div className="title-main">История джекпотов</div>
            <div className="title-subtitle">Последние победители</div>
          </div>
        </div>

        {/* Список истории */}
        <div className="history-list">
          {history.length === 0 ? (
            <div className="history-empty">
              <div className="empty-icon">🎰</div>
              <div className="empty-text">История джекпотов пуста</div>
              <div className="empty-subtitle">Будь первым победителем!</div>
            </div>
          ) : (
            history.map((item, index) => (
              <div key={index} className={`history-item ${item.jackpot ? 'jackpot-winner' : ''}`}>
                {/* Иконка победителя */}
                <div className="item-icon">
                  {item.jackpot ? (
                    <div className="winner-icon">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M19 3L19.5 5.5L22 6L19.5 6.5L19 9L18.5 6.5L16 6L18.5 5.5L19 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M5 3L5.5 5.5L8 6L5.5 6.5L5 9L4.5 6.5L2 6L4.5 5.5L5 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  ) : (
                    <div className="regular-icon">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                        <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </div>

                {/* Информация о победителе */}
                <div className="item-info">
                  <div className="winner-name">{item.winner}</div>
                  <div className="winner-details">
                    <span className="amount">{formatAmount(item.amount)} TON</span>
                    {item.participants && (
                      <span className="participants">• {item.participants} участников</span>
                    )}
                    {item.chance && (
                      <span className="chance">• {item.chance}% шанс</span>
                    )}
                  </div>
                </div>

                {/* Время */}
                <div className="item-time">
                  <div className="time-text">{getTimeAgo()}</div>
                  <div className="time-indicator"></div>
                </div>

                {/* Эффекты для джекпота */}
                {item.jackpot && (
                  <div className="jackpot-effects">
                    <div className="effect-sparkle sparkle-1"></div>
                    <div className="effect-sparkle sparkle-2"></div>
                    <div className="effect-sparkle sparkle-3"></div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Статистика */}
        {history.length > 0 && (
          <div className="history-stats">
            <div className="stat-item">
              <div className="stat-label">Всего джекпотов</div>
              <div className="stat-value">{history.filter(item => item.jackpot).length}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Общая сумма</div>
              <div className="stat-value">
                {formatAmount(history.reduce((sum, item) => sum + item.amount, 0))} TON
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Анимированные частицы */}
      <div className="history-particles">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className="particle"
            style={{ animationDelay: `${i * 0.4}s` }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default History; 