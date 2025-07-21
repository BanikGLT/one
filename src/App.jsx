// --- GLOBAL UI/UX UPDATE ---
import React, { useState, useEffect, useRef } from 'react';
import Background from './components/Background';
import TopBar from './components/TopBar';
import RouletteTable from './components/RouletteTable';
import Timer from './components/Timer';
import GiftButton from './components/GiftButton';
import History from './components/History';
import './App.css';

const initialPlayers = [];

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
  const [jackpotValue, setJackpotValue] = useState(0);
  const [showPointer, setShowPointer] = useState(false);
  const [pointerAngle, setPointerAngle] = useState(0);
  const [isShooting, setIsShooting] = useState(false);
  const [isRoundActive, setIsRoundActive] = useState(false);
  const [phase, setPhase] = useState('waiting'); // 'waiting' | 'spinning' | 'result'

  const wheelRef = useRef();

  // Обновление суммы джекпота
  useEffect(() => {
    const total = players.reduce((sum, p) => sum + (p.amount || 0), 0);
    setJackpotValue(total);
  }, [players]);

  // Функция проверки: есть ли 2+ активных игроков
  const hasActivePlayers = players.filter(p => !p.lost && p.name).length >= 2;

  // --- Исправленная логика таймера старта игры ---
  useEffect(() => {
    if (spinning) return;
    // Если сейчас показывается результат — ничего не делаем, ждём сброса
    if (phase === 'result') return;
    // Если игроков <2 и не в ожидании — сбросить всё и phase='waiting'
    if (players.length < 2 && phase !== 'waiting') {
      setPhase('waiting');
      setIsRunning(false);
      setTimer(0);
      setIsRoundActive(false);
      setShowPointer(false);
      setIsShooting(false);
      setSpinning(false);
      setWinnerIndex(null);
      setRotation(0);
      setPointerAngle(0);
      return;
    }
    // Если phase==='result' и появились новые игроки — только тогда вернуть phase='waiting'
    if (phase === 'result' && hasActivePlayers) {
      setPhase('waiting');
      setTimer(3);
      setIsRunning(true);
      setWinnerIndex(null);
      setRotation(0);
      setShowNotification(false);
      setIsRoundActive(false);
      setIsShooting(false);
      setSpinning(false);
      setPointerAngle(0);
      setShowPointer(false);
      return;
    }
    // Обычный старт раунда
    if (hasActivePlayers && !isRunning && timer === 0 && phase === 'waiting') {
      setPointerAngle(0);
      setShowPointer(false);
      setTimer(3);
      setIsRunning(true);
      setWinnerIndex(null);
      setRotation(0);
      setShowNotification(false);
      setIsRoundActive(false);
      setIsShooting(false);
      setSpinning(false);
    }
  }, [players, isRunning, spinning, timer, phase, hasActivePlayers]);

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
      setShowPointer(true);
      setIsRoundActive(true);
      setSpinning(false);
      setIsShooting(false);
      setWinnerIndex(null);
      setRotation(0);
      setPhase('spinning');
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
        const winnerPlayer = players[winner];
        if (!winnerPlayer) {
          setTimeout(() => {
            setSpinning(false);
            setShowPointer(false);
            setPlayers([]);
            setJackpotValue(0);
            setTimer(0);
            setWinnerIndex(null);
            setRotation(0);
            setShowNotification(false);
            setPointerAngle(0);
            setIsRoundActive(false);
            setPhase('waiting');
          }, 1000);
          return;
        }
        setWinnerIndex(winner);
        // --- Плавное вращение револьвера ---
        const playerCount = players.length;
        const anglePerPlayer = 360 / playerCount;
        const revolverSpins = 4; // количество оборотов
        const targetAngle = (anglePerPlayer * winner) % 360;
        const startAngle = pointerAngle % 360;
        let delta = targetAngle - startAngle;
        if (delta < 0) delta += 360;
        const finalAngle = startAngle + revolverSpins * 360 + delta;
        setPointerAngle(finalAngle); // <-- pointerAngle меняется только здесь
        setTimeout(() => {
          setIsShooting(true);
          setTimeout(() => {
            setIsShooting(false);
            setSpinning(false);
            setShowNotification(true);
            setNotificationText(`🎉 JACKPOT! @${winnerPlayer.name} выиграл ${jackpotValue.toFixed(2)} TON!`);
            setHistory(prev => [
              { 
                winner: '@' + winnerPlayer.name, 
                amount: jackpotValue, 
                chance: winnerPlayer.chance.toFixed(1),
                participants: players.length,
                jackpot: true
              },
              ...prev.slice(0, 19)
            ]);
            setPhase('result');
            setTimeout(() => {
              setPlayers([]);
              setJackpotValue(0);
              setTimer(0);
              setWinnerIndex(null);
              setRotation(0);
              setShowNotification(false);
              setIsRoundActive(false);
              setIsShooting(false);
              setSpinning(false);
              setShowPointer(false);
              setPointerAngle(0); // <-- pointerAngle сбрасывается только при полном сбросе
              setPhase('waiting');
            }, 5000);
          }, 800);
        }, 1800);
      }, 500);
    }
  }, [isRunning, timer, players, jackpotValue, pointerAngle]);

  const handleAddGift = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    const telegramNames = [
      'alex_winner', 'mega_player', 'lucky_one', 'jackpot_king', 'gift_master',
      'telegram_pro', 'winner_2024', 'lucky_star', 'gift_hunter', 'jackpot_boss',
      'telegram_elite', 'winner_zone', 'lucky_champ', 'gift_wizard', 'jackpot_ace'
    ];
    const randomName = telegramNames[Math.floor(Math.random() * telegramNames.length)];
    const giftAmount = Math.random() * 50 + 1;
    const giftChance = Math.random() * 25 + 5;
    const newPlayer = {
      name: randomName,
      chance: giftChance,
      amount: giftAmount
    };
    setPlayers(prev => [...prev, newPlayer]);
    setIsLoading(false);
    setShowNotification(true);
    setNotificationText(`🎁 @${randomName} добавил ${giftAmount.toFixed(2)} TON`);
    setTimeout(() => setShowNotification(false), 2000);
  };

  const totalGifts = players.length;
  const totalAmount = jackpotValue;

  const roulettePlayers = players.map((player, i) => ({
    id: i,
    name: player.name,
    avatarUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${player.name}`,
  }));

  return (
    <div className="app-container">
      <Background />
      <div className="app-content">
        <TopBar 
          totalGifts={totalGifts}
          totalAmount={totalAmount}
          isRunning={isRunning}
          timer={timer}
        />
        <div className="wheel-section">
          {/* Стол всегда виден */}
          <RouletteTable
            players={roulettePlayers}
            showPointer={phase !== 'waiting'}
            pointerAngle={pointerAngle}
            isShooting={isShooting}
            isRoundActive={isRoundActive}
          />
          {/* Таймер только если phase==='waiting', 2+ активных игроков и хотя бы один не проиграл */}
          {phase === 'waiting' && hasActivePlayers && timer > 0 && (
            <Timer 
              time={timer}
              isRunning={isRunning}
              isSpinning={spinning}
            />
          )}
        </div>
        <GiftButton
          onClick={handleAddGift}
          isLoading={isLoading}
          disabled={false}
          totalGifts={totalGifts}
        />
        <History 
          history={history}
        />
      </div>
      {/* Убраны всплывающие надписи для гифтов и победителя */}
    </div>
  );
}

export default App; 