import React, { useState, useRef } from 'react';
import RouletteTable from './RouletteTable';

// Примерные игроки с шансами
const initialPlayers = [
  { id: 1, name: 'User1', avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=1', chance: 30 },
  { id: 2, name: 'User2', avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=2', chance: 20 },
  { id: 3, name: 'User3', avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=3', chance: 25 },
  { id: 4, name: 'User4', avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=4', chance: 25 },
];

function getAlivePlayers(players) {
  return players.filter(p => !p.lost);
}

function getRandomLoser(players) {
  // Выбор проигравшего по шансам среди невыбывших
  const alive = getAlivePlayers(players);
  const totalChance = alive.reduce((sum, p) => sum + p.chance, 0);
  let rand = Math.random() * totalChance;
  for (let p of alive) {
    if (rand < p.chance) return p.id;
    rand -= p.chance;
  }
  return alive[alive.length - 1].id;
}

export default function RouletteGame() {
  const [players, setPlayers] = useState(initialPlayers.map(p => ({ ...p, lost: false })));
  const [pointerAngle, setPointerAngle] = useState(0);
  const [isShooting, setIsShooting] = useState(false);
  const [currentLoser, setCurrentLoser] = useState(null);
  const [winner, setWinner] = useState(null);
  const isRunning = useRef(false);

  // Вычисляем углы для каждого игрока (по кругу)
  const getPlayerAngles = () => {
    const count = players.length;
    return players.map((p, i) => (360 * i) / count);
  };

  // Запуск игры (цикл выстрелов)
  const startGame = async () => {
    if (isRunning.current) return;
    isRunning.current = true;
    let roundPlayers = [...players];
    let round = 0;
    while (getAlivePlayers(roundPlayers).length > 1) {
      round++;
      // Выбираем проигравшего по шансам
      const loserId = getRandomLoser(roundPlayers);
      const loserIdx = roundPlayers.findIndex(p => p.id === loserId);
      // Вычисляем угол для револьвера
      const angles = getPlayerAngles();
      setPointerAngle(angles[loserIdx]);
      setCurrentLoser(loserId);
      setIsShooting(false);
      await new Promise(res => setTimeout(res, 300)); // Вращение (ускорено для тестов)
      setIsShooting(true);
      await new Promise(res => setTimeout(res, 600)); // Выстрел
      // Помечаем проигравшего
      roundPlayers = roundPlayers.map(p => p.id === loserId ? { ...p, lost: true } : p);
      setPlayers(roundPlayers);
      setIsShooting(false);
      await new Promise(res => setTimeout(res, 700));
    }
    // Победитель
    const winnerObj = getAlivePlayers(roundPlayers)[0];
    setWinner(winnerObj.id);
    setPointerAngle(getPlayerAngles()[roundPlayers.findIndex(p => p.id === winnerObj.id)]);
    setCurrentLoser(null);
    isRunning.current = false;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', background: '#181c24' }}>
      <RouletteTable
        players={players.map((p, i) => ({ ...p, isLoser: p.lost, isWinner: winner === p.id }))}
        pointerAngle={pointerAngle}
        isShooting={isShooting}
        showPointer={true}
      />
      <div style={{ marginTop: 32 }}>
        <button
          onClick={startGame}
          style={{ padding: '14px 32px', fontSize: 20, borderRadius: 10, background: '#38bdf8', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}
          disabled={isRunning.current || winner}
        >
          {winner ? 'Игра завершена' : 'Запустить игру'}
        </button>
        {winner && (
          <div style={{ marginTop: 24, fontSize: 28, color: '#22c55e', fontWeight: 700 }}>
            Победитель: {players.find(p => p.id === winner)?.name}
          </div>
        )}
      </div>
    </div>
  );
} 