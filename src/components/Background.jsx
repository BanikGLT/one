import React, { useEffect, useState } from 'react';
import './Background.css';

const Background = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [time, setTime] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      });
    };

    const handleTimeUpdate = () => {
      setTime(prev => prev + 0.01);
    };

    window.addEventListener('mousemove', handleMouseMove);
    const timeInterval = setInterval(handleTimeUpdate, 16);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(timeInterval);
    };
  }, []);

  return (
    <div className="background-container">
      {/* Основной градиентный фон */}
      <div className="background-gradient"></div>
      
      {/* Анимированный паттерн */}
      <div className="background-pattern">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(56,189,248,0.03)" strokeWidth="0.5"/>
            </pattern>
            <radialGradient id="spotlight" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(56,189,248,0.1)" stopOpacity="0"/>
              <stop offset="50%" stopColor="rgba(56,189,248,0.05)" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="rgba(56,189,248,0)" stopOpacity="0"/>
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)"/>
          <rect width="100%" height="100%" fill="url(#spotlight)"/>
        </svg>
      </div>
      
      {/* Интерактивные частицы */}
      <div className="interactive-particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 20}s`
            }}
          ></div>
        ))}
      </div>
      
      {/* Световые эффекты */}
      <div className="light-effects">
        <div 
          className="spotlight"
          style={{
            left: `${mousePosition.x * 100}%`,
            top: `${mousePosition.y * 100}%`
          }}
        ></div>
        <div 
          className="spotlight secondary"
          style={{
            left: `${(1 - mousePosition.x) * 100}%`,
            top: `${(1 - mousePosition.y) * 100}%`
          }}
        ></div>
      </div>
      
      {/* Анимированные волны */}
      <div className="wave-container">
        <div className="wave wave-1" style={{ animationDelay: '0s' }}></div>
        <div className="wave wave-2" style={{ animationDelay: '2s' }}></div>
        <div className="wave wave-3" style={{ animationDelay: '4s' }}></div>
      </div>
      
      {/* Дополнительные эффекты */}
      <div className="background-effects">
        <div className="effect-ring ring-1" style={{ transform: `rotate(${time * 10}deg)` }}></div>
        <div className="effect-ring ring-2" style={{ transform: `rotate(${time * -15}deg)` }}></div>
        <div className="effect-ring ring-3" style={{ transform: `rotate(${time * 20}deg)` }}></div>
      </div>
      
      {/* Градиентные пятна */}
      <div className="gradient-spots">
        <div className="spot spot-1"></div>
        <div className="spot spot-2"></div>
        <div className="spot spot-3"></div>
        <div className="spot spot-4"></div>
      </div>
      
      {/* Дымчатый эффект */}
      <div className="smoke-effect">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="smoke-particle"
            style={{
              left: `${20 + i * 15}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${15 + i * 5}s`
            }}
          ></div>
        ))}
      </div>
      
      {/* Звездное небо */}
      <div className="stars">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          ></div>
        ))}
      </div>
      
      {/* Энергетические линии */}
      <div className="energy-lines">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="energy-line"
            style={{
              left: `${i * 12.5}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${8 + i * 2}s`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Background; 