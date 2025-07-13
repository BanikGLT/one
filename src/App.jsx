// --- GLOBAL UI/UX UPDATE ---
import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const initialPlayers = [
  { name: 'Alirizo_MS', chance: 16.11, amount: 5.59 },
  { name: 'halfbacks', chance: 24.5, amount: 8.5 },
  { name: 'toporowner', chance: 25.92, amount: 8.99 },
  { name: 'ialyou', chance: 28.83, amount: 10 },
  { name: 'user5', chance: 4.61, amount: 1.6 },
  { name: 'user6', chance: 33.57, amount: 4.8 },
];

const wheelColors = [
  '#22c55e', // зелёный
  '#38bdf8', // голубой
  '#a78bfa', // фиолетовый
  '#fbbf24', // жёлтый
  '#f472b6', // розовый
  '#818cf8', // сине-фиолетовый
  '#f87171', // красный
  '#34d399', // салатовый
  '#60a5fa', // синий
  '#facc15', // лимонный
];

function getWheelSegments(players) {
  return players.map((p, i) => ({
    label: `${p.chance.toFixed(2)}%`,
    value: p.chance,
    color: wheelColors[i % wheelColors.length],
  }));
}

function App() {
  const [players, setPlayers] = useState(initialPlayers);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [winnerIndex, setWinnerIndex] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationText, setNotificationText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [buttonPressed, setButtonPressed] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [history, setHistory] = useState([
    { winner: '@bearstg', amount: 72, chance: 68 },
    { winner: '@Gasan_M...', amount: 4030, chance: 48 },
    { winner: '@user6', amount: 10, chance: 33.57 },
    { winner: '@halfbacks', amount: 8.5, chance: 24.5 },
  ]);
  const wheelRef = useRef();
  const audioRef = useRef();

  // Звуковые эффекты (заглушка)
  useEffect(() => {
    audioRef.current = new Audio();
  }, []);

  const playSound = (type) => {};

  const showNotificationMessage = (text, duration = 3000) => {
    setNotificationText(text);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), duration);
  };

  // Старт игры только при 2+ игроках
  const canStart = players.length >= 2 && !isRunning && !spinning && timer === 0;

  // Автоматический старт игры при 2+ игроках
  useEffect(() => {
    if (players.length >= 2 && !isRunning && !spinning && timer === 0) {
      setTimer(30);
      setIsRunning(true);
      setWinnerIndex(null);
      setRotation(0);
      setShowNotification(false);
    }
  }, [players, isRunning, spinning, timer]);

  // Таймер и запуск вращения
  useEffect(() => {
    if (!isRunning && timer === 0) return;
    if (isRunning && timer > 0) {
      const interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && isRunning) {
      setIsRunning(false);
      setTimeout(() => {
        setSpinning(true);
        // Выбор победителя
        const rand = Math.random() * 100;
        let acc = 0;
        let winner = 0;
        for (let i = 0; i < players.length; i++) {
          acc += players[i].chance;
          if (rand <= acc) {
            winner = i;
            break;
          }
        }
        setWinnerIndex(winner);
        // Анимация вращения
        const total = players.reduce((sum, p) => sum + p.chance, 0);
        let accAngle = 0;
        for (let i = 0; i < winner; i++) {
          accAngle += (players[i].chance / total) * 360;
        }
        const winnerAngle = accAngle + (players[winner].chance / total) * 180;
        setRotation(360 * 5 - winnerAngle);
        setTimeout(() => {
          setSpinning(false);
          setShowNotification(true);
          setNotificationText(`Победитель: @${players[winner].name}!`);
          // Добавить в историю
          setHistory(prev => [
            { winner: '@' + players[winner].name, amount: players[winner].amount, chance: players[winner].chance.toFixed(2) },
            ...prev.slice(0, 19)
          ]);
          // Сбросить состояние через 3 сек
          setTimeout(() => {
            setPlayers(initialPlayers);
            setTimer(0);
            setWinnerIndex(null);
            setRotation(0);
            setShowNotification(false);
          }, 3000);
        }, 3500);
      }, 500);
    }
  }, [isRunning, timer, players]);

  const handleAddGift = async () => {
    setIsLoading(true);
    setButtonPressed(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    const newPlayer = {
      name: `user${players.length + 1}`,
      chance: Math.random() * 30 + 5,
      amount: Math.random() * 10 + 1
    };
    setPlayers(prev => [...prev, newPlayer]);
    setIsLoading(false);
    setButtonPressed(false);
  };

  const handleStart = () => {
    if (canStart) {
      setTimer(30);
      setIsRunning(true);
      setWinnerIndex(null);
      setRotation(0);
      setShowNotification(false);
    }
  };

  const totalGifts = players.length;
  const totalAmount = players.reduce((sum, p) => sum + p.amount, 0);
  const wheelSegments = getWheelSegments(players);
  const leaderIndex = players.reduce((maxIdx, p, i, arr) => p.chance > arr[maxIdx].chance ? i : maxIdx, 0);
  const maxChance = players.length ? Math.max(...players.map(p => p.chance)) : 0;
  const minChance = players.length ? Math.min(...players.map(p => p.chance)) : 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start text-white px-2 py-4 relative overflow-hidden">
      {/* Фон */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-b from-[#23243a] via-[#181926] to-[#181926] opacity-100"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_20%,rgba(60,60,90,0.2)_0%,rgba(24,25,38,0.8)_100%)]"></div>
      </div>

      {/* Верхний блок */}
      <div className="top-block">
        <span className="icon">🎁</span>
        <span>{totalGifts} гифтов</span>
        <span className="icon">💎</span>
        <span>{totalAmount.toFixed(2)} TON</span>
      </div>

      {/* Колесо и таймер */}
      <div className="wheel-container">
        <Wheel
          segments={wheelSegments}
          spinning={spinning}
          winnerIndex={winnerIndex}
          rotation={rotation}
          ref={wheelRef}
        />
        <div className="timer-center">
          <span className="timer-value">{String(timer).padStart(2, '0')}</span>
          <span className="timer-label">сек</span>
        </div>
      </div>

      {/* Кнопка добавления гифтов */}
      <button
        onClick={handleAddGift}
        disabled={isLoading}
        className="btn-main"
      >
        🎁 Добавить гифтов
      </button>

      {/* История раундов/победителей */}
      <div className="players-list" style={{marginTop:'2.5rem'}}>
        <div className="player-row" style={{color:'#bfc9d1',fontWeight:600,marginBottom:'0.7em'}}>История раундов</div>
        {history.map((r, i) => (
          <div key={i} className="player-row" style={{display:'flex',alignItems:'center',gap:'0.7em'}}>
            <span style={{fontWeight:600}}>{r.winner}</span>
            <span style={{color:'#22c55e',fontWeight:500}}>{r.amount} TON</span>
            <span style={{color:'#38bdf8',fontWeight:500}}>шанс {r.chance}%</span>
            <span style={{fontSize:'1.2em',marginLeft:'0.5em'}}>🏆</span>
          </div>
        ))}
      </div>

      {/* Панель эмодзи */}
      <div className="emoji-panel">
        <span>😀</span>
        <span>🎉</span>
        <span>🔥</span>
        <span>💎</span>
        <span>🥳</span>
        <span>😎</span>
      </div>

      {/* Статистика */}
      <div className="mt-4 text-center text-sm text-neutral-500 block-animate w-full max-w-[320px] sm:max-w-[420px] mx-auto rounded-2xl">
        <div>Максимальный шанс: {maxChance.toFixed(2)}%</div>
        <div>Минимальный шанс: {minChance.toFixed(2)}%</div>
      </div>

      {/* Уведомление */}
      {showNotification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 glass block-shadow px-6 py-3 rounded-2xl shadow-lg flex items-center gap-2 fade-in" style={{textShadow:'0 2px 8px #23243a'}}>
          <span className="text-white font-medium">{notificationText}</span>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// Колесо с яркими секторами и процентами внутри
const Wheel = React.forwardRef(({ segments, spinning, winnerIndex, rotation }, ref) => {
  const size = 340;
  const radius = size / 2;
  let startAngle = 0;
  const totalValue = segments.reduce((sum, s) => sum + s.value, 0);
  const segmentAngles = segments.map((s, i) => {
    const angle = (s.value / totalValue) * 360;
    const start = startAngle;
    startAngle += angle;
    return { ...s, startAngle: start, endAngle: startAngle, angle };
  });
  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{transition:'transform 3.5s cubic-bezier(.4,2,.6,1)',transform:`rotate(${rotation}deg)`}}
    >
      <g transform={`translate(${radius}, ${radius})`}>
        {segmentAngles.map((segment, i) => {
          const startRad = (segment.startAngle * Math.PI) / 180;
          const endRad = (segment.endAngle * Math.PI) / 180;
          const x1 = radius * Math.cos(startRad);
          const y1 = radius * Math.sin(startRad);
          const x2 = radius * Math.cos(endRad);
          const y2 = radius * Math.sin(endRad);
          const largeArcFlag = segment.angle > 180 ? 1 : 0;
          const pathData = [
            `M 0 0`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            'Z',
          ].join(' ');
          return (
            <g key={i}>
              <path
                d={pathData}
                fill={segment.color}
                stroke="#181926"
                strokeWidth="4"
              />
              {/* Проценты внутри сектора */}
              <text
                x={((radius * 0.65) * Math.cos(((segment.startAngle + segment.angle/2) * Math.PI) / 180))}
                y={((radius * 0.65) * Math.sin(((segment.startAngle + segment.angle/2) * Math.PI) / 180))}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#23243a"
                fontSize="1.15em"
                fontWeight="700"
                style={{pointerEvents:'none'}}
              >
                {segment.label}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
});
Wheel.displayName = 'Wheel';

// Иконки теперь только в серо-синих/серебристых тонах
function TonIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="10" fill="#23243a" />
      <path d="M12 6v7.5M12 17a1 1 0 1 0 0-2a1 1 0 0 0 0 2z" stroke="#bfc9d1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

function GiftIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <rect x="3" y="8" width="18" height="13" rx="3" fill="#23243a" />
      <rect x="9" y="2" width="6" height="6" rx="3" fill="#2a3147" />
      <path d="M12 8v13" stroke="#bfc9d1" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export default App; 