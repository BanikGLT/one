import React from 'react';
import './TopBar.css';

// Пример данных для карточек истории (можно заменить на реальные из props)
const leftHistory = {
  avatar: 'https://i.pravatar.cc/32?img=1',
  username: '@bearstg',
  amount: 72,
  chance: 68
};
const rightHistory = {
  avatar: 'https://i.pravatar.cc/32?img=2',
  username: '@Gasan_M...',
  amount: 4030,
  chance: 48
};

const TopBar = ({ totalGifts, totalAmount, isRunning, timer }) => {
  return (
    <div className="topbar-ref-container">
      {/* Левая карточка истории */}
      <div className="topbar-history-card left">
        <img src={leftHistory.avatar} alt="avatar" className="history-avatar" />
        <div className="history-info">
          <div className="history-username">{leftHistory.username}</div>
          <div className="history-amount">выиграл {leftHistory.amount} TON</div>
          <div className="history-chance">шанс {leftHistory.chance}%</div>
        </div>
      </div>
      {/* Центральный светлый блок */}
      <div className="topbar-main-ref">
        <span className="topbar-gifts">{totalGifts} гифтов</span>
        <span className="topbar-divider">|</span>
        <span className="topbar-amount">{totalAmount.toFixed(2)} TON</span>
      </div>
      {/* Правая карточка истории */}
      <div className="topbar-history-card right">
        <img src={rightHistory.avatar} alt="avatar" className="history-avatar" />
        <div className="history-info">
          <div className="history-username">{rightHistory.username}</div>
          <div className="history-amount">выиграл {rightHistory.amount} TON</div>
          <div className="history-chance">шанс {rightHistory.chance}%</div>
        </div>
      </div>
    </div>
  );
};

export default TopBar; 