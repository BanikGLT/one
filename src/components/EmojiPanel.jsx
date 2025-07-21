import React from 'react';
import './EmojiPanel.css';

const EmojiPanel = ({ onEmojiClick }) => {
  const emojis = [
    { id: 1, emoji: '🎉', label: 'Праздник' },
    { id: 2, emoji: '🔥', label: 'Огонь' },
    { id: 3, emoji: '💎', label: 'Алмаз' },
    { id: 4, emoji: '🚀', label: 'Ракета' },
    { id: 5, emoji: '⭐', label: 'Звезда' },
    { id: 6, emoji: '💪', label: 'Сила' },
    { id: 7, emoji: '🎯', label: 'Цель' },
    { id: 8, emoji: '🏆', label: 'Трофей' }
  ];

  return (
    <div className="emoji-panel">
      <div className="emoji-panel-header">
        <h4>Реакции</h4>
      </div>
      <div className="emoji-grid">
        {emojis.map((emoji) => (
          <button
            key={emoji.id}
            className="emoji-button"
            onClick={() => onEmojiClick(emoji)}
            title={emoji.label}
          >
            <span className="emoji-icon">{emoji.emoji}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmojiPanel; 