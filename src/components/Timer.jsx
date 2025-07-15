import React, { useEffect, useState } from 'react';
import './Timer.css';

const Timer = ({ time, isRunning, isSpinning }) => {
  const [pulse, setPulse] = useState(false);
  const [glow, setGlow] = useState(false);

  // Эффект пульсации при изменении времени
  useEffect(() => {
    if (time <= 10 && time > 0) {
      setPulse(true);
      setTimeout(() => setPulse(false), 200);
    }
  }, [time]);

  // Эффект свечения при запуске
  useEffect(() => {
    if (isRunning && time === 30) {
      setGlow(true);
      setTimeout(() => setGlow(false), 1000);
    }
  }, [isRunning, time]);

  const formatTime = (seconds) => {
    return String(seconds).padStart(2, '0');
  };

  const getTimeColor = () => {
    if (time <= 5) return '#ef4444'; // красный
    if (time <= 10) return '#f59e0b'; // оранжевый
    if (time <= 20) return '#eab308'; // желтый
    return '#38bdf8'; // синий
  };

  const getTimeSize = () => {
    if (time <= 5) return '3.2rem';
    if (time <= 10) return '3rem';
    return '2.8rem';
  };

  return (
    <div className="timer-container">
      {/* Внешняя тень */}
      <div className="timer-shadow"></div>
      
      {/* Основной контейнер */}
      <div className={`timer-main ${pulse ? 'pulse' : ''} ${glow ? 'glow' : ''}`}>
        {/* Фоновая подсветка */}
        <div className="timer-glow" style={{ backgroundColor: getTimeColor() }}></div>
        
        {/* Внутренний круг */}
        <div className="timer-inner">
          {/* Прогресс-кольцо */}
          <svg className="timer-progress" width="120" height="120" viewBox="0 0 120 120">
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={getTimeColor()} stopOpacity="0.3" />
                <stop offset="50%" stopColor={getTimeColor()} stopOpacity="0.6" />
                <stop offset="100%" stopColor={getTimeColor()} stopOpacity="0.3" />
              </linearGradient>
            </defs>
            
            {/* Фоновое кольцо */}
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="rgba(56,189,248,0.1)"
              strokeWidth="4"
            />
            
            {/* Прогресс */}
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="url(#progressGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${(time / 30) * 339.292} 339.292`}
              transform="rotate(-90 60 60)"
              className="progress-ring"
            />
          </svg>
          
          {/* Центральное содержимое */}
          <div className="timer-content">
            <div className="timer-value" style={{ 
              color: getTimeColor(),
              fontSize: getTimeSize()
            }}>
              {formatTime(time)}
            </div>
            <div className="timer-label">сек</div>
          </div>
        </div>
        
        {/* Статусные индикаторы */}
        {isRunning && (
          <div className="timer-status">
            <div className="status-dot"></div>
          </div>
        )}
        
        {isSpinning && (
          <div className="spinning-indicator">
            <div className="spinning-dots">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>
        )}
      </div>
      
      {/* Анимированные частицы */}
      <div className="timer-particles">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i} 
            className="particle" 
            style={{ 
              animationDelay: `${i * 0.3}s`,
              backgroundColor: getTimeColor()
            }}
          ></div>
        ))}
      </div>
      
      {/* Дополнительные эффекты */}
      <div className="timer-effects">
        <div className="effect-ring ring-1"></div>
        <div className="effect-ring ring-2"></div>
        <div className="effect-ring ring-3"></div>
      </div>
    </div>
  );
};

export default Timer; 