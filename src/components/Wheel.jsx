import React, { forwardRef, useRef, useEffect, useState } from 'react';
import './Wheel.css';

const Wheel = forwardRef(({ segments, spinning, winnerIndex, rotation, time }, ref) => {
  const containerRef = useRef();
  const [size, setSize] = useState(420);

  useEffect(() => {
    if (containerRef.current) {
      setSize(containerRef.current.offsetWidth);
    }
    const handleResize = () => {
      if (containerRef.current) setSize(containerRef.current.offsetWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const center = size / 2;
  const radius = center - 8;

  if (segments.length === 0) {
    return (
      <div className="wheel-container" ref={containerRef}>
        <div className="wheel-empty">
          <div className="wheel-empty-icon">🎰</div>
          <div className="wheel-empty-text">Добавьте гифты для начала игры</div>
        </div>
      </div>
    );
  }

  const totalValue = segments.reduce((sum, segment) => sum + segment.value, 0);
  let currentAngle = 0;

  // Если 1 игрок — весь круг его цветом
  if (segments.length === 1) {
    return (
      <div className="wheel-container" ref={containerRef}>
        <svg
          className={`wheel-svg ${spinning ? 'spinning' : ''}`}
          width={size}
          height={size}
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <defs>
            <filter id="avatarShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.4" />
            </filter>
          </defs>
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill={segments[0].color}
            className="wheel-segment"
          />
          {/* Center black circle */}
          <circle
            cx={center}
            cy={center}
            r={center - size * 0.28}
            fill="#111"
            stroke="#222"
            strokeWidth={size * 0.018}
            filter="url(#avatarShadow)"
          />
        </svg>
        {/* Таймер по центру */}
        {typeof time === 'number' && (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              background: '#111',
              borderRadius: '50%',
              width: size * 0.36,
              height: size * 0.36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 16px #000a',
              border: '4px solid #222',
              zIndex: 10,
            }}
          >
            <span style={{
              color: '#fff',
              fontSize: size * 0.11,
              fontWeight: 700,
              fontFamily: 'Inter, Arial, sans-serif',
              letterSpacing: 1,
              textShadow: '0 2px 8px #000',
            }}>{String(time).padStart(2, '0')}</span>
          </div>
        )}
        <div className="wheel-pointer"></div>
      </div>
    );
  }

  // SVG sectors для нескольких игроков
  const sectors = segments.map((segment, i) => {
    const angle = (segment.value / totalValue) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    const largeArc = angle > 180 ? 1 : 0;
    const startRad = (Math.PI / 180) * startAngle;
    const endRad = (Math.PI / 180) * endAngle;
    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);
    // Центр сектора для плашки you
    const midAngle = startAngle + angle / 2;
    const midRad = (Math.PI / 180) * midAngle;
    const youX = center + (radius * 0.8) * Math.cos(midRad);
    const youY = center + (radius * 0.8) * Math.sin(midRad);
    const path = [
      `M ${center} ${center}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      'Z',
    ].join(' ');
    const isWinner = spinning && winnerIndex === i;
    currentAngle += angle;
    // isYou: временно считаем что первый игрок (i === 0) — вы
    const isYou = segment.isYou || i === 0;
    return (
      <g key={i}>
        <path
          d={path}
          fill={segment.color}
          className={isWinner ? 'wheel-segment winner' : 'wheel-segment'}
        />
        {/* Плашка you */}
        {isYou && (
          <g>
            <rect
              x={youX - size * 0.06}
              y={youY - size * 0.025}
              rx={size * 0.025}
              ry={size * 0.025}
              width={size * 0.12}
              height={size * 0.05}
              fill="#fff"
              opacity="0.92"
              stroke="#222"
              strokeWidth={size * 0.004}
              filter="url(#avatarShadow)"
            />
            <text
              x={youX}
              y={youY + size * 0.017}
              textAnchor="middle"
              fontSize={size * 0.032}
              fontWeight="bold"
              fill="#222"
              style={{
                userSelect: 'none',
                fontFamily: 'Inter, Arial, sans-serif',
                letterSpacing: '1px',
              }}
            >
              you
            </text>
          </g>
        )}
      </g>
    );
  });

  return (
    <div className="wheel-container" ref={containerRef}>
      <svg
        className={`wheel-svg ${spinning ? 'spinning' : ''}`}
        width={size}
        height={size}
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <defs>
          <filter id="avatarShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.4" />
          </filter>
        </defs>
        {sectors}
        {/* Center black circle */}
        <circle
          cx={center}
          cy={center}
          r={center - size * 0.28}
          fill="#111"
          stroke="#222"
          strokeWidth={size * 0.018}
          filter="url(#avatarShadow)"
        />
      </svg>
      {/* Таймер по центру */}
      {typeof time === 'number' && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#111',
            borderRadius: '50%',
            width: size * 0.36,
            height: size * 0.36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 16px #000a',
            border: '4px solid #222',
            zIndex: 10,
          }}
        >
          <span style={{
            color: '#fff',
            fontSize: size * 0.11,
            fontWeight: 700,
            fontFamily: 'Inter, Arial, sans-serif',
            letterSpacing: 1,
            textShadow: '0 2px 8px #000',
          }}>{String(time).padStart(2, '0')}</span>
        </div>
      )}
      <div className="wheel-pointer"></div>
    </div>
  );
});

Wheel.displayName = 'Wheel';

export default Wheel; 