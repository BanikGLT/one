import React from 'react';
import './Timer.css';

const Timer = ({ time, isRunning, isSpinning }) => {
  if (!isRunning && !isSpinning) {
    return null;
  }

  return (
    <div className="timer-container">
      <div className={`timer ${isSpinning ? 'spinning' : ''}`}>
        <div className="timer-value">{time}s</div>
        <div className="timer-label">
          {isSpinning ? 'Крутим!' : 'Время'}
        </div>
      </div>
    </div>
  );
};

export default Timer; 