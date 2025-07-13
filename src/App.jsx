// --- GLOBAL UI/UX UPDATE ---
import React, { useState, useEffect, useRef } from 'react';
import './index.css';

const initialPlayers = [
  { name: 'Alirizo_MS', chance: 16.11, amount: 5.59 },
  { name: 'halfbacks', chance: 24.5, amount: 8.5 },
  { name: 'toporowner', chance: 25.92, amount: 8.99 },
  { name: 'ialyou', chance: 28.83, amount: 10 },
  { name: 'user5', chance: 4.61, amount: 1.6 },
];

function getWheelSegments(players) {
  return players.map((p) => ({
    label: `${p.chance.toFixed(2)}%`,
    value: p.chance,
  }));
}

function App() {
  const [players, setPlayers] = useState(initialPlayers);
  const [timer, setTimer] = useState(30);
  const [isRunning, setIsRunning] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const [winnerIndex, setWinnerIndex] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationText, setNotificationText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [buttonPressed, setButtonPressed] = useState(false);
  const [rotation, setRotation] = useState(0);
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

  // Таймер и запуск вращения
  useEffect(() => {
    let interval;
    if (isRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
    } else if (timer === 0 && isRunning) {
      clearInterval(interval);
      setIsRunning(false);
      // Запуск анимации вращения только после таймера
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
        // 5 оборотов + нужный сектор
        setRotation(360 * 5 - winnerAngle);
        // Плавная остановка и показ победителя после анимации
        setTimeout(() => {
          setSpinning(false);
          showNotificationMessage(`Победитель: @${players[winner].name}!`, 5000);
        }, 3500);
      }, 500); // небольшая пауза после таймера
    }
    return () => clearInterval(interval);
  }, [isRunning, timer, players]);

  const handleAddGift = async () => {
    if (isRunning) return;
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
    showNotificationMessage('Гифт добавлен!', 2000);
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
      <div className="flex items-center justify-center gap-2 mt-2 mb-6 z-10 block-animate w-full max-w-[320px] sm:max-w-[420px] rounded-2xl glass block-shadow">
        <div className="flex items-center rounded-2xl px-4 py-2 w-1/2 min-w-[120px] justify-center block-animate">
          <GiftIcon className="w-5 h-5 mr-2 text-green-400" />
          <span className="text-base font-medium">{totalGifts} гифтов</span>
        </div>
        <div className="flex items-center rounded-2xl px-4 py-2 w-1/2 min-w-[120px] justify-center block-animate">
          <TonIcon className="w-5 h-5 mr-2 text-blue-400" />
          <span className="text-base font-medium">{totalAmount.toFixed(2)} TON</span>
        </div>
      </div>

      {/* Барабан и стрелка */}
      <div className={`relative flex flex-col items-center mb-6 w-full max-w-[320px] sm:max-w-[420px] z-10 block-animate rounded-2xl glass block-shadow ${spinning ? 'scale-105 duration-700' : 'scale-100 duration-500'}`}>
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20">
          <div className="w-8 h-8 flex items-center justify-center glow">
            <svg width="32" height="32" viewBox="0 0 32 32"><polygon points="16,0 28,16 4,16" fill="#fff" stroke="#23243a" strokeWidth="2"/></svg>
          </div>
        </div>
        <Wheel
          segments={wheelSegments}
          spinning={spinning}
          winnerIndex={winnerIndex}
          rotation={rotation}
          ref={wheelRef}
        />
        {/* Таймер */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className={`glass block-shadow rounded-full w-24 h-24 sm:w-32 sm:h-32 flex flex-col items-center justify-center border-4 border-[#23243a] shadow-xl transition-all duration-500 ${timer <= 10 ? 'border-[#bfc9d1] glow animate-pulse' : ''}`}
            style={{boxShadow: timer <= 10 ? '0 0 24px 4px #bfc9d155' : undefined}}>
            <span className={`text-2xl sm:text-3xl font-medium tracking-widest ${timer <= 10 ? 'text-[#bfc9d1]' : 'text-white'}`}>{String(timer).padStart(2, '0')}</span>
            <span className="text-xs sm:text-sm mt-1 text-neutral-400">сек</span>
          </div>
        </div>
      </div>

      {/* Кнопка добавления гифтов */}
      <button
        onClick={handleAddGift}
        disabled={isRunning || isLoading}
        className={`relative font-medium py-4 px-8 rounded-2xl mb-6 shadow-lg text-lg flex items-center justify-center transition-all duration-200 w-full max-w-xs overflow-hidden block-animate focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2a3147]/60 glass block-shadow ${isRunning || isLoading ? 'bg-[#23243a] text-neutral-500 cursor-not-allowed opacity-80' : 'bg-[#23243a] hover:bg-[#283046] active:bg-[#181926] text-white'} ${buttonPressed ? 'scale-95' : ''}`}
        style={{position:'relative'}}>
        <span className="absolute inset-0 pointer-events-none rounded-2xl" style={{boxShadow:buttonPressed?'0 0 24px 4px #bfc9d155':'none',transition:'box-shadow 0.3s'}}></span>
        <GiftIcon className="w-6 h-6 mr-2" />
        {isLoading ? 'Загрузка...' : 'Добавить гифтов'}
      </button>

      {/* Список игроков */}
      <div className="w-full max-w-xs sm:max-w-md glass block-shadow rounded-2xl p-2 sm:p-4 block-animate divide-y divide-[#2e2f4a] border border-[#2e2f4a] relative z-10 box-border">
        <div className="text-center text-sm text-neutral-400 mb-2 font-medium">Участники</div>
        {players.map((p, i) => (
          <div
            key={i}
            className={`flex items-center justify-between py-3 px-2 sm:px-4 transition-all duration-500 hover:bg-[#23243a]/80 cursor-pointer block-animate ${i === leaderIndex ? 'bg-blue-900/20 border-l-4 border-blue-400 shadow-md glow' : ''} ${winnerIndex === i && !isRunning ? 'ring-2 ring-cyan-400 bg-cyan-900/10 glow' : ''}`}
            style={{ animation: `fadeIn 0.5s ${i * 0.1}s both` }}
            onClick={() => showNotificationMessage(`@${p.name}: ${p.chance.toFixed(2)}% шанс`, 2000)}
          >
            <div className="flex items-center">
              <span className="font-medium text-base sm:text-lg">@{p.name}</span>
              {i === leaderIndex && (
                <span className="ml-2 text-yellow-400 text-lg" title="Лидер">👑</span>
              )}
              {winnerIndex === i && !isRunning && (
                <span className="ml-2 text-green-400 text-lg" title="Победитель">🏆</span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-400 font-medium text-base sm:text-lg">{p.chance.toFixed(2)}%</span>
              <span className="text-neutral-300 text-base sm:text-lg flex items-center">
                <TonIcon className="w-4 h-4 mr-1" />
                {p.amount.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Статистика */}
      <div className="mt-4 text-center text-sm text-neutral-500 block-animate w-full max-w-[320px] sm:max-w-[420px] mx-auto rounded-2xl">
        <div>Максимальный шанс: {maxChance.toFixed(2)}%</div>
        <div>Минимальный шанс: {minChance.toFixed(2)}%</div>
      </div>

      {/* Уведомление */}
      {showNotification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 glass block-shadow px-6 py-3 rounded-2xl shadow-lg flex items-center gap-2 fade-in" style={{textShadow:'0 2px 8px #23243a'}}>
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#23243a"/><path d="M12 7v5" stroke="#bfc9d1" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="16" r="1" fill="#bfc9d1"/></svg>
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

// Колесо с анимацией вращения
const Wheel = React.forwardRef(({ segments, spinning, winnerIndex, rotation }, ref) => {
  const size = 320;
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
    <div className={`relative z-10 w-full max-w-[320px] mx-auto transition-transform duration-700 ${spinning ? 'scale-105 glow' : ''} ${winnerIndex !== null && !spinning ? 'glow' : ''}`}>
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={`transition-transform duration-[3500ms] ease-out drop-shadow-[0_0_32px_rgba(34,211,238,0.18)] max-w-full`}
        style={{
          filter: winnerIndex !== null && !spinning ? 'drop-shadow(0 0 32px #22d3ee)' : '',
          transform: `rotate(${rotation}deg)`
        }}
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
            const colors = [
              '#23243a', // антрацит
              '#1e2233', // глубокий синий
              '#283046', // графитовый
              '#22263a', // тёмно-синий
              '#2a3147', // серо-синий
              '#1a1d29', // почти чёрный
              '#25304a', // сине-графитовый
              '#20232e', // глубокий серый
              '#2b3348', // стальной
              '#181926'  // тёмный фон
            ];
            // Центр подписи (выносим проценты наружу, не накладываются)
            const midAngle = segment.startAngle + segment.angle / 2;
            // Если сектор маленький, проценты чуть ближе к кругу
            const labelRadius = radius * (segment.angle < 40 ? 0.82 : 0.88);
            const labelX = labelRadius * Math.cos((midAngle * Math.PI) / 180);
            const labelY = labelRadius * Math.sin((midAngle * Math.PI) / 180);
            return (
              <g key={i}>
                <path
                  d={pathData}
                  fill={colors[i % colors.length]}
                  stroke="#23243a"
                  strokeWidth="2"
                />
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#bfc9d1"
                  fontSize="15"
                  fontWeight="500"
                  style={{ pointerEvents: 'none', paintOrder: 'stroke', stroke: '#23243a', strokeWidth: 2, textShadow: '0 2px 8px #23243a' }}
                >
                  {segment.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
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