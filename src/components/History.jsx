import React from 'react';
import './History.css';

const History = ({ history }) => {
  if (history.length === 0) {
    return (
      <div className="history-container">
        <div className="history-header">
          <h3>История джекпотов</h3>
        </div>
        <div className="history-empty">
          <div className="history-empty-icon">📜</div>
          <div className="history-empty-text">История пуста</div>
        </div>
      </div>
    );
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <h3>История джекпотов</h3>
      </div>
      <div className="history-list">
        {history.map((item, index) => (
          <div key={index} className="history-item">
            <div className="history-item-icon">🎰</div>
            <div className="history-item-content">
              <div className="history-item-winner">{item.winner}</div>
              <div className="history-item-details">
                {item.amount.toFixed(2)} TON • {item.chance}% • {item.participants} игроков
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History; 