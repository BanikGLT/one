import { useState, useEffect, useRef } from 'react';
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
  const wheelRef = useRef();
  const audioRef = useRef();

  // Звуковые эффекты
  useEffect(() => {
    audioRef.current = new Audio();
  }, []);

  const playSound = (type) => {
    if (audioRef.current) {
      // Здесь можно добавить реальные звуковые файлы
      // audioRef.current.src = `/sounds/${type}.mp3`;
      // audioRef.current.play();
    }
  };

  const showNotificationMessage = (text, duration = 3000) => {
    setNotificationText(text);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), duration);
  };

  useEffect(() => {
    let interval;
    if (isRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => {
          const newTime = t - 1;
          if (newTime <= 10 && newTime > 0) {
            playSound('tick');
          }
          return newTime;
        });
      }, 1000);
    } else if (timer === 0 && isRunning) {
      clearInterval(interval);
      playSound('spin');
      setSpinning(true);
      
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
      
      setTimeout(() => {
        setSpinning(false);
        setIsRunning(false);
        playSound('win');
        showNotificationMessage(`Победитель: @${players[winner].name}!`, 5000);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timer, players]);

  const handleAddGift = async () => {
    if (isRunning) return;
    
    setIsLoading(true);
    setButtonPressed(true);
    playSound('click');
    
    // Имитация загрузки
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Добавляем нового игрока (для демонстрации)
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

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white px-2 py-4 relative overflow-hidden">
      {/* Анимированный фон */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
        <div className="absolute top-20 right-20 w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-1 h-1 bg-purple-400 rounded-full animate-bounce"></div>
      </div>

      {/* Уведомление */}
      {showNotification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce">
          {notificationText}
        </div>
      )}

      {/* Блок с банком и количеством гифтов */}
      <div className="flex flex-col items-center mb-4 w-full max-w-xs sm:max-w-md relative z-10">
        <div className="flex items-center justify-center bg-neutral-900 rounded-xl shadow-lg px-4 py-3 w-full border border-neutral-700 hover:border-neutral-600 transition-colors duration-300">
          <span className="text-xl font-bold mr-2 flex items-center">
            <GiftIcon className="w-5 h-5 mr-1" />
            {totalGifts} гифтов
          </span>
          <span className="text-neutral-400 mx-2">·</span>
          <span className="text-xl font-bold ml-2 flex items-center">
            <TonIcon className="w-5 h-5 mr-1" />
            {totalAmount.toFixed(2)} TON
          </span>
        </div>
      </div>

      {/* Барабан */}
      <div className="relative flex flex-col items-center mb-6 w-full z-10">
        <Wheel
          segments={wheelSegments}
          spinning={spinning}
          winnerIndex={winnerIndex}
          ref={wheelRef}
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className={`bg-black bg-opacity-90 rounded-full w-24 h-24 sm:w-32 sm:h-32 flex flex-col items-center justify-center border-4 border-neutral-700 shadow-xl transition-all duration-300 ${timer <= 10 ? 'border-red-500 animate-pulse' : ''}`}>
            <span className={`text-2xl sm:text-3xl font-bold ${timer <= 10 ? 'text-red-400' : ''}`}>
              {String(timer).padStart(2, '0')}
            </span>
            <span className="text-xs sm:text-sm mt-1 text-neutral-400">сек</span>
          </div>
        </div>
      </div>

      {/* Кнопка добавления гифтов */}
      <button
        onClick={handleAddGift}
        disabled={isRunning || isLoading}
        className={`relative font-bold py-4 px-8 rounded-xl mb-6 shadow-lg text-lg flex items-center justify-center transition-all duration-200 w-full max-w-xs overflow-hidden ${
          isRunning || isLoading
            ? 'bg-neutral-600 text-neutral-400 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white hover:scale-105 active:scale-95'
        } ${buttonPressed ? 'scale-95' : ''}`}
      >
        {isLoading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Загрузка...
          </div>
        ) : (
          <>
            <GiftIcon className="w-6 h-6 mr-2" />
            Добавить гифт
          </>
        )}
        <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-200"></div>
      </button>

      {/* Список игроков */}
      <div className="w-full max-w-xs sm:max-w-md bg-neutral-900 rounded-xl p-2 sm:p-4 shadow-lg divide-y divide-neutral-800 border border-neutral-700 relative z-10">
        <div className="text-center text-sm text-neutral-400 mb-2 font-medium">Участники</div>
        {players.map((p, i) => (
          <div
            key={i}
            className={`flex items-center justify-between py-3 px-2 sm:px-4 transition-all duration-500 hover:bg-neutral-800 cursor-pointer ${
              i === leaderIndex ? 'bg-blue-900/40 border-l-4 border-blue-400 shadow-md' : ''
            } ${winnerIndex === i && !isRunning ? 'ring-2 ring-green-400 bg-green-900/20' : ''}`}
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
              <span className="text-blue-400 font-semibold text-base sm:text-lg">{p.chance.toFixed(2)}%</span>
              <span className="text-neutral-300 text-base sm:text-lg flex items-center">
                <TonIcon className="w-4 h-4 mr-1" />
                {p.amount.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Статистика */}
      <div className="mt-4 text-center text-sm text-neutral-500">
        <div>Максимальный шанс: {Math.max(...players.map(p => p.chance)).toFixed(2)}%</div>
        <div>Минимальный шанс: {Math.min(...players.map(p => p.chance)).toFixed(2)}%</div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Колесо с анимацией вращения
const Wheel = React.forwardRef(({ segments, spinning, winnerIndex }, ref) => {
  const size = 320;
  const radius = size / 2;
  let startAngle = 0;
  
  let winnerAngle = 0;
  if (winnerIndex !== null) {
    for (let i = 0; i < segments.length; i++) {
      if (i < winnerIndex) winnerAngle += (segments[i].value / 100) * 360;
    }
    winnerAngle += (segments[winnerIndex].value / 100) * 360 / 2;
  }
  
  const spins = 5;
  const rotation = spinning && winnerIndex !== null
    ? 360 * spins - winnerAngle
    : 0;

  return (
    <svg
      width={size}
      height={size}
      className="z-0 drop-shadow-2xl"
      style={{
        transition: spinning ? 'transform 3s cubic-bezier(0.23, 1, 0.32, 1)' : 'none',
        transform: `rotate(${rotation}deg)`
      }}
      ref={ref}
      viewBox={`0 0 ${size} ${size}`}
    >
      {segments.map((seg, i) => {
        const angle = (seg.value / 100) * 360;
        const x1 = radius + radius * Math.cos((Math.PI * startAngle) / 180);
        const y1 = radius + radius * Math.sin((Math.PI * startAngle) / 180);
        const x2 = radius + radius * Math.cos((Math.PI * (startAngle + angle)) / 180);
        const y2 = radius + radius * Math.sin((Math.PI * (startAngle + angle)) / 180);
        const largeArc = angle > 180 ? 1 : 0;
        const pathData = `M${radius},${radius} L${x1},${y1} A${radius},${radius} 0 ${largeArc} 1 ${x2},${y2} Z`;
        
        const colors = ['#ffe066', '#63e6be', '#845ef7', '#ff6b6b', '#4dabf7', '#ffa94d'];
        const fill = colors[i % colors.length];
        
        const midAngle = startAngle + angle / 2;
        const textX = radius + (radius * 0.6) * Math.cos((Math.PI * midAngle) / 180);
        const textY = radius + (radius * 0.6) * Math.sin((Math.PI * midAngle) / 180);
        
        const el = (
          <g key={i}>
            <path d={pathData} fill={fill} opacity={0.85} />
            <text
              x={textX}
              y={textY}
              fill="#222"
              fontSize="1.2em"
              fontWeight="bold"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {seg.label}
            </text>
          </g>
        );
        startAngle += angle;
        return el;
      })}
      
      {/* Улучшенная стрелка-указатель */}
      <polygon 
        points={`${radius - 12},12 ${radius + 12},12 ${radius},38`} 
        fill="#fff" 
        filter="drop-shadow(0 0 8px #00f6ff)"
        className="animate-pulse"
      />
    </svg>
  );
});

// Иконка TON
function TonIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#161C2D" />
      <path d="M16 24L8 10H24L16 24Z" fill="#00BFFF" />
      <path d="M16 20L11 12H21L16 20Z" fill="#fff" />
    </svg>
  );
}

// Иконка подарка
function GiftIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="8" width="18" height="13" rx="2" fill="#fff" stroke="#00BFFF" />
      <path d="M12 8V21" stroke="#00BFFF" strokeWidth={2} />
      <path d="M3 12H21" stroke="#00BFFF" strokeWidth={2} />
      <circle cx="8.5" cy="5.5" r="2.5" fill="#00BFFF" />
      <circle cx="15.5" cy="5.5" r="2.5" fill="#00BFFF" />
    </svg>
  );
}

export default App;
