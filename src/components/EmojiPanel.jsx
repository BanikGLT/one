import React, { useState, useEffect } from 'react';
import './EmojiPanel.css';

const EmojiPanel = ({ isVisible, onEmojiClick }) => {
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [hoveredEmoji, setHoveredEmoji] = useState(null);

  const emojis = [
    { id: 'fire', emoji: '🔥', label: 'Огонь', color: '#ef4444' },
    { id: 'diamond', emoji: '💎', label: 'Алмаз', color: '#38bdf8' },
    { id: 'star', emoji: '⭐', label: 'Звезда', color: '#eab308' },
    { id: 'crown', emoji: '👑', label: 'Корона', color: '#f59e0b' },
    { id: 'rocket', emoji: '🚀', label: 'Ракета', color: '#22c55e' },
    { id: 'trophy', emoji: '🏆', label: 'Трофей', color: '#a78bfa' },
    { id: 'clap', emoji: '👏', label: 'Аплодисменты', color: '#f472b6' },
    { id: 'heart', emoji: '❤️', label: 'Сердце', color: '#f87171' },
    { id: 'party', emoji: '🎉', label: 'Праздник', color: '#34d399' },
    { id: 'cool', emoji: '😎', label: 'Круто', color: '#60a5fa' },
    { id: 'smile', emoji: '😀', label: 'Улыбка', color: '#facc15' },
    { id: 'money', emoji: '💰', label: 'Деньги', color: '#22c55e' }
  ];

  const handleEmojiClick = (emoji) => {
    setSelectedEmoji(emoji.id);
    if (onEmojiClick) {
      onEmojiClick(emoji);
    }
    
    // Сброс выбора через 1 секунду
    setTimeout(() => {
      setSelectedEmoji(null);
    }, 1000);
  };

  const handleEmojiHover = (emojiId) => {
    setHoveredEmoji(emojiId);
  };

  const handleEmojiLeave = () => {
    setHoveredEmoji(null);
  };

  return (
    <div className={`emoji-panel-container ${isVisible ? 'visible' : ''}`}>
      {/* Фоновая подсветка */}
      <div className="panel-glow"></div>
      
      {/* Основной контейнер */}
      <div className="emoji-panel">
        {/* Заголовок */}
        <div className="panel-header">
          <div className="header-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="header-text">Реакции</span>
        </div>

        {/* Сетка эмодзи */}
        <div className="emoji-grid">
          {emojis.map((emoji, index) => (
            <div
              key={emoji.id}
              className={`emoji-item ${selectedEmoji === emoji.id ? 'selected' : ''} ${hoveredEmoji === emoji.id ? 'hovered' : ''}`}
              style={{ 
                animationDelay: `${index * 0.1}s`,
                '--emoji-color': emoji.color
              }}
              onClick={() => handleEmojiClick(emoji)}
              onMouseEnter={() => handleEmojiHover(emoji.id)}
              onMouseLeave={handleEmojiLeave}
            >
              {/* Фоновая подсветка */}
              <div className="emoji-glow"></div>
              
              {/* Эмодзи */}
              <div className="emoji-content">
                <span className="emoji-char">{emoji.emoji}</span>
              </div>
              
              {/* Тултип */}
              {hoveredEmoji === emoji.id && (
                <div className="emoji-tooltip">
                  <span>{emoji.label}</span>
                  <div className="tooltip-arrow"></div>
                </div>
              )}
              
              {/* Эффект клика */}
              <div className="click-effect"></div>
              
              {/* Анимированные частицы */}
              <div className="emoji-particles">
                {[...Array(3)].map((_, i) => (
                  <div 
                    key={i} 
                    className="particle"
                    style={{ 
                      animationDelay: `${i * 0.2}s`,
                      backgroundColor: emoji.color
                    }}
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Дополнительные эффекты */}
        <div className="panel-effects">
          <div className="effect-ring ring-1"></div>
          <div className="effect-ring ring-2"></div>
          <div className="effect-ring ring-3"></div>
        </div>
      </div>

      {/* Анимированные частицы фона */}
      <div className="background-particles">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i} 
            className="bg-particle"
            style={{ animationDelay: `${i * 0.5}s` }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default EmojiPanel; 