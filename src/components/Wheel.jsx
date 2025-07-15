import React, { forwardRef } from 'react';
import './Wheel.css';

const Wheel = forwardRef(({ segments, spinning, winnerIndex, rotation, isVisible }, ref) => {
  const radius = 150;
  const centerX = 170;
  const centerY = 170;
  
  const createWheelPath = () => {
    if (!segments.length) return [];
    
    const total = segments.reduce((sum, seg) => sum + seg.value, 0);
    let currentAngle = 0;
    
    return segments.map((segment, index) => {
      const angle = (segment.value / total) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      
      const x1 = centerX + radius * Math.cos((startAngle - 90) * Math.PI / 180);
      const y1 = centerY + radius * Math.sin((startAngle - 90) * Math.PI / 180);
      const x2 = centerX + radius * Math.cos((endAngle - 90) * Math.PI / 180);
      const y2 = centerY + radius * Math.sin((endAngle - 90) * Math.PI / 180);
      
      const largeArcFlag = angle > 180 ? 1 : 0;
      
      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ');
      
      currentAngle = endAngle;
      
      return {
        path: pathData,
        label: segment.label,
        color: segment.color,
        centerAngle: startAngle + angle / 2
      };
    });
  };

  const wheelPaths = createWheelPath();

  return (
    <div className={`wheel-wrapper ${isVisible ? 'visible' : ''}`}>
      {/* Внешняя тень колеса */}
      <div className="wheel-shadow"></div>
      
      {/* Основное колесо */}
      <div className={`wheel ${spinning ? 'spinning' : ''}`}>
        <svg
          ref={ref}
          width="340"
          height="340"
          viewBox="0 0 340 340"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? 'none' : 'transform 0.1s ease-out'
          }}
        >
          {/* Фоновый круг для пустого состояния */}
          {segments.length === 0 && (
            <circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="rgba(35,36,58,0.3)"
              stroke="rgba(56,189,248,0.2)"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          )}
          
          {/* Секторы колеса */}
          {wheelPaths.map((segment, index) => (
            <g key={index}>
              <path
                d={segment.path}
                fill={segment.color}
                stroke="#1a1a2e"
                strokeWidth="3"
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
              />
              
              {/* Проценты внутри сектора */}
              <text
                x={centerX + (radius * 0.65) * Math.cos((segment.centerAngle - 90) * Math.PI / 180)}
                y={centerY + (radius * 0.65) * Math.sin((segment.centerAngle - 90) * Math.PI / 180)}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#ffffff"
                fontSize="14"
                fontWeight="700"
                textShadow="0 2px 4px rgba(0,0,0,0.8)"
                style={{ pointerEvents: 'none' }}
              >
                {segment.label}
              </text>
            </g>
          ))}
          
          {/* Разделительные линии */}
          {wheelPaths.map((segment, index) => {
            const angle = segment.centerAngle - 90;
            const x = centerX + radius * Math.cos(angle * Math.PI / 180);
            const y = centerY + radius * Math.sin(angle * Math.PI / 180);
            
            return (
              <line
                key={`line-${index}`}
                x1={centerX}
                y1={centerY}
                x2={x}
                y2={y}
                stroke="#1a1a2e"
                strokeWidth="2"
                opacity="0.8"
              />
            );
          })}
        </svg>
        
        {/* Центральная стрелка */}
        <div className="wheel-pointer">
          <div className="pointer-arrow"></div>
          <div className="pointer-glow"></div>
        </div>
      </div>
      
      {/* Анимированные частицы вокруг колеса */}
      <div className="wheel-particles">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i} 
            className="particle"
            style={{ animationDelay: `${i * 0.5}s` }}
          ></div>
        ))}
      </div>
      
      {/* Эффект свечения при вращении */}
      {spinning && (
        <div className="spinning-glow"></div>
      )}
      
      {/* Пустое состояние */}
      {segments.length === 0 && (
        <div className="empty-wheel-state">
          <div className="empty-icon">🎯</div>
          <div className="empty-text">Добавьте гифтов для начала игры</div>
        </div>
      )}
    </div>
  );
});

Wheel.displayName = 'Wheel';

export default Wheel; 