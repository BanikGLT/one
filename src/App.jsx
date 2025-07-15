// --- GLOBAL UI/UX UPDATE ---
import React, { useState, useEffect, useRef } from 'react';
import Background from './components/Background';
import TopBar from './components/TopBar';
import Wheel from './components/Wheel';
import Timer from './components/Timer';
import GiftButton from './components/GiftButton';
import History from './components/History';
import EmojiPanel from './components/EmojiPanel';
import './App.css';

// Пустое начальное состояние для джекпота
const initialPlayers = [];

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
    label: `${p.chance.toFixed(1)}%`,
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
  const [rotation, setRotation] = useState(0);
  const [history, setHistory] = useState([]);
  const [jackpotValue, setJackpotValue] = useState(0); // Общая сумма джекпота
  const [componentsVisible, setComponentsVisible] = useState({
    topBar: false,
    wheel: false,
    button: false,
    history: false,
    emojiPanel: false
  });

  const wheelRef = useRef();
  const audioRef = useRef();

  // Звуковые эффекты (заглушка)
  useEffect(() => {
    audioRef.current = new Audio();
  }, []);

  const playSound = (type) => {
    // Заглушка для звуковых эффектов
  };

  const showNotificationMessage = (text, duration = 3000) => {
    setNotificationText(text);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), duration);
  };

  // Анимация появления компонентов
  useEffect(() => {
    const timer = setTimeout(() => setComponentsVisible(prev => ({ ...prev, topBar: true })), 200);
    const timer2 = setTimeout(() => setComponentsVisible(prev => ({ ...prev, wheel: true })), 400);
    const timer3 = setTimeout(() => setComponentsVisible(prev => ({ ...prev, button: true })), 600);
    const timer4 = setTimeout(() => setComponentsVisible(prev => ({ ...prev, history: true })), 800);
    const timer5 = setTimeout(() => setComponentsVisible(prev => ({ ...prev, emojiPanel: true })), 1000);

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, []);

  // Обновление суммы джекпота
  useEffect(() => {
    const total = players.reduce((sum, p) => sum + p.amount, 0);
    setJackpotValue(total);
  }, [players]);

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
        // Выбор победителя джекпота
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
          setNotificationText(`🎉 JACKPOT! @${players[winner].name} выиграл ${jackpotValue.toFixed(2)} TON!`);
          // Добавить в историю джекпота
          setHistory(prev => [
            { 
              winner: '@' + players[winner].name, 
              amount: jackpotValue, 
              chance: players[winner].chance.toFixed(1),
              participants: players.length,
              jackpot: true
            },
            ...prev.slice(0, 19)
          ]);
          // Сбросить состояние через 3 сек
          setTimeout(() => {
            setPlayers([]); // Очищаем игроков после джекпота
            setJackpotValue(0);
            setTimer(0);
            setWinnerIndex(null);
            setRotation(0);
            setShowNotification(false);
          }, 3000);
        }, 3500);
      }, 500);
    }
  }, [isRunning, timer, players, jackpotValue]);

  const handleAddGift = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Генерируем случайного пользователя с Telegram-подобным именем
    const telegramNames = [
      'alex_winner', 'mega_player', 'lucky_one', 'jackpot_king', 'gift_master',
      'telegram_pro', 'winner_2024', 'lucky_star', 'gift_hunter', 'jackpot_boss',
      'telegram_elite', 'winner_zone', 'lucky_champ', 'gift_wizard', 'jackpot_ace'
    ];
    
    const randomName = telegramNames[Math.floor(Math.random() * telegramNames.length)];
    const giftAmount = Math.random() * 50 + 1; // Случайная сумма гифта 1-50 TON
    const giftChance = Math.random() * 25 + 5; // Шанс 5-30%
    
    const newPlayer = {
      name: randomName,
      chance: giftChance,
      amount: giftAmount
    };
    
    setPlayers(prev => [...prev, newPlayer]);
    setIsLoading(false);
    
    // Показываем уведомление о добавлении гифта
    showNotificationMessage(`🎁 @${randomName} добавил ${giftAmount.toFixed(2)} TON`, 2000);
  };

  const handleEmojiClick = (emoji) => {
    showNotificationMessage(`Реакция: ${emoji.label}`, 2000);
  };

  const totalGifts = players.length;
  const totalAmount = jackpotValue;
  const wheelSegments = getWheelSegments(players);

  return (
    <div className={`app-container ${isRunning ? 'game-active' : ''}`}>
      {/* Премиальный фон */}
      <Background />
      
      {/* Основной контент */}
      <div className="app-content">
        {/* Верхняя панель */}
        <TopBar 
          totalGifts={totalGifts}
          totalAmount={totalAmount}
          isRunning={isRunning}
          timer={timer}
          isVisible={componentsVisible.topBar}
        />

        {/* Колесо и таймер */}
        <div className="wheel-section">
          <Wheel
            segments={wheelSegments}
            spinning={spinning}
            winnerIndex={winnerIndex}
            rotation={rotation}
            ref={wheelRef}
            isVisible={componentsVisible.wheel}
          />
          <Timer 
            time={timer}
            isRunning={isRunning}
            isSpinning={spinning}
          />
        </div>

        {/* Кнопка добавления гифтов */}
        <GiftButton
          onClick={handleAddGift}
          isLoading={isLoading}
          disabled={false}
          totalGifts={totalGifts}
          isVisible={componentsVisible.button}
        />

        {/* История джекпотов */}
        <History 
          history={history}
          isVisible={componentsVisible.history}
        />

        {/* Панель эмодзи */}
        <EmojiPanel
          isVisible={componentsVisible.emojiPanel}
          onEmojiClick={handleEmojiClick}
        />
      </div>

      {/* Уведомление о джекпоте */}
      {showNotification && (
        <div className="notification-overlay">
          <div className="notification-content jackpot-notification">
            <div className="notification-icon">🎰</div>
            <div className="notification-text">{notificationText}</div>
            <div className="notification-glow"></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App; 