import React, { useState } from 'react';
import RouletteTable from './RouletteTable';

export default function RevolverDemo() {
  const [angle, setAngle] = useState(0);
  const [shoot, setShoot] = useState(false);

  const handleRotate = () => setAngle(a => a + 45);
  const handleShoot = () => {
    setShoot(true);
    setTimeout(() => setShoot(false), 500);
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#181c24',
    }}>
      <RouletteTable pointerAngle={angle} isShooting={shoot} showPointer={true} />
      <div style={{ marginTop: 32, display: 'flex', gap: 16 }}>
        <button
          onClick={handleRotate}
          style={{ padding: '12px 24px', fontSize: 18, borderRadius: 8, background: '#38bdf8', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 500 }}
        >
          Повернуть
        </button>
        <button
          onClick={handleShoot}
          style={{ padding: '12px 24px', fontSize: 18, borderRadius: 8, background: '#f87171', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 500 }}
        >
          Выстрел
        </button>
      </div>
    </div>
  );
} 