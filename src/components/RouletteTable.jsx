import React, { useRef, useEffect, useState } from 'react';

const SLOT_COUNT = 10;

// Примерные данные для теста (заменить на реальные)
const testPlayers = [
  { id: 1, name: 'User1', avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=1' },
  { id: 2, name: 'User2', avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=2' },
  { id: 3, name: 'User3', avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=3' },
  { id: 4, name: 'User4', avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=4' },
];

function RouletteTable({ players = testPlayers, showPointer = false, pointerAngle = 0, isShooting = false, isRoundActive = false }) {
  const size = 420;
  const center = size / 2;
  const radius = center - 50;
  const slotRadius = 40;

  // Количество активных участников
  const activePlayers = players.filter(p => p !== null).length;
  const playerCount = Math.max(2, Math.min(activePlayers, SLOT_COUNT));

  const revolverRef = useRef(null);
  const audioRef = useRef(null);
  const [revolverAnim, setRevolverAnim] = useState({ angle: 0, animating: false });
  const [kickback, setKickback] = useState(false);
  const [showSmoke, setShowSmoke] = useState(false);
  const [shake, setShake] = useState(false);
  const prevPointerAngle = useRef(pointerAngle);

  // Анимация вращения только во время активного раунда
  useEffect(() => {
    if (showPointer && isRoundActive && pointerAngle !== prevPointerAngle.current) {
      // Считаем разницу между текущим и целевым углом
      const from = prevPointerAngle.current % 360;
      const to = pointerAngle % 360;
      let delta = to - from;
      if (delta < 0) delta += 360;
      const animAngle = from + 1080 + delta;
      setRevolverAnim({ angle: animAngle, animating: true });
      setTimeout(() => {
        setRevolverAnim({ angle: to, animating: false });
        prevPointerAngle.current = pointerAngle;
      }, 3000);
    }
  }, [pointerAngle, showPointer, isRoundActive]);

  // Сброс prevPointerAngle при полном сбросе (револьвер скрыт и угол 0)
  useEffect(() => {
    if (!showPointer && pointerAngle === 0) {
      prevPointerAngle.current = 0;
      setRevolverAnim({ angle: 0, animating: false });
    }
  }, [showPointer, pointerAngle]);

  // Эффект выстрела: отдача, дым, дрожание
  useEffect(() => {
    if (isShooting && isRoundActive) {
      setKickback(true);
      setShowSmoke(true);
      setShake(true);
      setTimeout(() => setKickback(false), 180);
      setTimeout(() => setShowSmoke(false), 1200);
      setTimeout(() => setShake(false), 500);
    }
  }, [isShooting, isRoundActive]);

  useEffect(() => {
    if (isShooting && revolverRef.current) {
      // Добавляем класс для анимации выстрела
      revolverRef.current.classList.add('shoot');
      setTimeout(() => {
        revolverRef.current.classList.remove('shoot');
      }, 400); // длительность анимации
    }
    if (isShooting && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  }, [isShooting]);

  return (
    <div style={{ width: size, height: size, position: 'relative', margin: '0 auto' }}>
      <svg width={size} height={size} style={{ display: 'block', transition: shake ? 'transform 0.1s' : '', transform: shake ? 'translate('+(Math.random()*8-4)+'px,'+(Math.random()*8-4)+'px)' : 'none' }}>
        <defs>
          {/* Градиент для тёмного стола */}
          <radialGradient id="tableGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0f0f23" />
            <stop offset="50%" stopColor="#1a1a2e" />
            <stop offset="100%" stopColor="#16213e" />
          </radialGradient>
          
          {/* Градиент для ободка стола */}
          <linearGradient id="rimGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#333" />
            <stop offset="50%" stopColor="#555" />
            <stop offset="100%" stopColor="#333" />
          </linearGradient>
          
          {/* Градиент для секторов */}
          <radialGradient id="sectorGradient" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#2d3748" />
            <stop offset="100%" stopColor="#1a202c" />
          </radialGradient>
          
          {/* Градиент для центральной области */}
          <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1a202c" />
            <stop offset="100%" stopColor="#0f1419" />
          </radialGradient>
          
          {/* Тени */}
          <filter id="tableShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#000" floodOpacity="0.6" />
          </filter>
          
          <filter id="sectorShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.5" />
          </filter>
          
          <filter id="avatarGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#38bdf8" floodOpacity="0.6" />
          </filter>
        </defs>
        
        {/* Внешний ободок стола */}
        <circle 
          cx={center} 
          cy={center} 
          r={center - 4} 
          fill="url(#rimGradient)" 
          filter="url(#tableShadow)"
        />
        
        {/* Основная поверхность стола */}
        <circle 
          cx={center} 
          cy={center} 
          r={center - 12} 
          fill="url(#tableGradient)" 
        />
        
        {/* Секторы по количеству участников */}
        {players.slice(0, playerCount).map((player, i) => {
          const angle = (2 * Math.PI * i) / playerCount - Math.PI / 2;
          const nextAngle = (2 * Math.PI * (i + 1)) / playerCount - Math.PI / 2;
          const largeArc = (2 * Math.PI / playerCount) > Math.PI ? 1 : 0;
          
          const x1 = center + (center - 20) * Math.cos(angle);
          const y1 = center + (center - 20) * Math.sin(angle);
          const x2 = center + (center - 20) * Math.cos(nextAngle);
          const y2 = center + (center - 20) * Math.sin(nextAngle);
          
          const path = [
            `M ${center} ${center}`,
            `L ${x1} ${y1}`,
            `A ${center - 20} ${center - 20} 0 ${largeArc} 1 ${x2} ${y2}`,
            'Z',
          ].join(' ');
          
          // Позиция аватарки в центре сектора
          const midAngle = angle + (2 * Math.PI / playerCount) / 2;
          const avatarX = center + (radius * 0.7) * Math.cos(midAngle);
          const avatarY = center + (radius * 0.7) * Math.sin(midAngle);
          
          return (
            <g key={i}>
              {/* Сектор */}
              <path
                d={path}
                fill="url(#sectorGradient)"
                stroke="#444"
                strokeWidth="2"
                filter="url(#sectorShadow)"
              />
              
              {/* Аватарка игрока */}
              {player && (
                <g>
                  <defs>
                    <clipPath id={`avatarClip${i}`}>
                      <circle cx={avatarX} cy={avatarY} r={slotRadius - 8} />
                    </clipPath>
                  </defs>
                  {/* Подсветка аватарки */}
                  <circle
                    cx={avatarX}
                    cy={avatarY}
                    r={slotRadius - 6}
                    fill="none"
                    stroke={player.isWinner ? '#22c55e' : '#38bdf8'}
                    strokeWidth={player.isWinner ? 5 : 3}
                    opacity="0.6"
                    filter="url(#avatarGlow)"
                  />
                  <image
                    href={player.avatarUrl}
                    x={avatarX - slotRadius + 8}
                    y={avatarY - slotRadius + 8}
                    width={2 * (slotRadius - 8)}
                    height={2 * (slotRadius - 8)}
                    clipPath={`url(#avatarClip${i})`}
                  />
                  {/* Внутренняя подсветка */}
                  <circle
                    cx={avatarX}
                    cy={avatarY}
                    r={slotRadius - 8}
                    fill="none"
                    stroke="#fff"
                    strokeWidth="1"
                    opacity="0.3"
                  />
                  {/* Череп для проигравших */}
                  {player.isLoser && (
                    <foreignObject
                      x={avatarX - 18}
                      y={avatarY - 18}
                      width={36}
                      height={36}
                    >
                      <div style={{ fontSize: 32, textAlign: 'center', lineHeight: '36px', filter: 'drop-shadow(0 0 4px #000)' }}>💀</div>
                    </foreignObject>
                  )}
                </g>
              )}
            </g>
          );
        })}
        
        {/* Центральная область (меньше) */}
        <circle 
          cx={center} 
          cy={center} 
          r={center - 120} 
          fill="url(#centerGradient)" 
          stroke="#444" 
          strokeWidth="3"
        />
        
        {/* Внутренний круг центра */}
        <circle 
          cx={center} 
          cy={center} 
          r={center - 130} 
          fill="none" 
          stroke="#555" 
          strokeWidth="2"
          opacity="0.5"
        />
      </svg>
      
      {/* Центральный указатель (heavy-revolver.png) */}
      {showPointer && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 260,
            height: 80,
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <div
            ref={revolverRef}
            style={{
              width: 260,
              height: 80,
              position: 'relative',
              transform: `rotate(${revolverAnim.animating ? revolverAnim.angle : pointerAngle}deg) scaleX(${kickback ? 1.08 : 1}) translateX(${kickback ? '-12px' : '0'})`,
              transformOrigin: '52% 54%', // центр барабана для PNG heavy-revolver
              transition: revolverAnim.animating ? 'transform 3s cubic-bezier(.22,1.2,.4,1)' : 'transform 0.18s cubic-bezier(.7,-0.2,.7,1.5)',
              filter: kickback ? 'drop-shadow(0 0 16px #fff8)' : 'none',
            }}
            className={"revolver-img-wrapper" + (isShooting ? ' shoot' : '')}
          >
            <img
              src="/heavy-revolver.png"
              alt="Heavy Revolver"
              style={{
                width: 260,
                height: 80,
                objectFit: 'contain',
                display: 'block',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
              draggable={false}
            />
            {/* Вспышка выстрела (SVG glow) */}
            <svg
              className="revolver-flash"
              style={{
                position: 'absolute',
                left: 245,
                top: 36,
                width: 44,
                height: 44,
                pointerEvents: 'none',
                opacity: 0,
                zIndex: 2,
              }}
              viewBox="0 0 44 44"
            >
              <radialGradient id="flashGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fff" stopOpacity="1" />
                <stop offset="40%" stopColor="#ffd700" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ff9800" stopOpacity="0" />
              </radialGradient>
              <circle cx="22" cy="22" r="18" fill="url(#flashGlow)" />
            </svg>
            {/* Дым после выстрела */}
            {showSmoke && (
              <svg
                style={{
                  position: 'absolute',
                  left: 255,
                  top: 28,
                  width: 36,
                  height: 36,
                  pointerEvents: 'none',
                  zIndex: 1,
                  opacity: 0.7,
                  animation: 'smoke-fade 1.2s linear forwards',
                }}
                viewBox="0 0 36 36"
              >
                <ellipse cx="18" cy="18" rx="12" ry="7" fill="#ccc" opacity="0.5" />
                <ellipse cx="18" cy="12" rx="7" ry="4" fill="#eee" opacity="0.3" />
                <ellipse cx="24" cy="20" rx="4" ry="2" fill="#fff" opacity="0.2" />
              </svg>
            )}
            {/* Звук выстрела */}
            <audio ref={audioRef} src="/gunshot.wav" preload="auto" />
          </div>
          <style>{`
            .revolver-img-wrapper.shoot .revolver-flash {
              opacity: 0.92;
              animation: flash-bang-img 0.38s cubic-bezier(.7,0,.7,1.2);
            }
            @keyframes flash-bang-img {
              0% { opacity: 0; transform: scale(0.2); }
              18% { opacity: 0.92; transform: scale(1.25); }
              100% { opacity: 0; transform: scale(0.2); }
            }
            @keyframes smoke-fade {
              0% { opacity: 0.7; transform: translateY(0) scale(1); }
              60% { opacity: 0.5; transform: translateY(-8px) scale(1.1); }
              100% { opacity: 0; transform: translateY(-18px) scale(1.18); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}

export default RouletteTable; 