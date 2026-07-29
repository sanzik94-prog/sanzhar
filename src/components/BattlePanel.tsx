interface BattlePanelProps {
  room: number;
  loot: number;
  enemiesLeft: number;
  totalEnemies: number;
  health: number;
  time: number;
  cooldown: number;
  status: 'playing' | 'won' | 'lost';
  onShoot: () => void;
  onRetry: () => void;
  onNextRoom: () => void;
}

export function BattlePanel({
  room,
  loot,
  enemiesLeft,
  totalEnemies,
  health,
  time,
  cooldown,
  status,
  onShoot,
  onRetry,
  onNextRoom,
}: BattlePanelProps) {
  return (
    <section className="battle-card">
      <div className="battle-top">
        <span className="eyebrow">БОЕВАЯ КОМНАТА {room}</span>
        <span className="signal">● СЕЙЧАС ОНЛАЙН</span>
      </div>
      <h2>Сразись с бандитами</h2>
      <p>Веди героя по арене, стреляй по роботам и выживай до окончания таймера.</p>
      <div className="battle-stats">
        <span>ВРАГОВ <b>{enemiesLeft}/{totalEnemies}</b></span>
        <span>ЗДОРОВЬЕ <b>{health}%</b></span>
        <span>ТАЙМЕР <b>{String(time).padStart(2, '0')}</b></span>
      </div>
      {status === 'playing' ? (
        <>
          <button className="primary-button" onClick={onShoot} disabled={cooldown > 0}>
            {cooldown > 0 ? `ПЕРЕЗАРЯДКА ${cooldown}` : 'СТРЕЛЬ'} <span>SPACE</span>
          </button>
          <small>WASD / стрелки — движение</small>
          <div className="battle-summary">
            <span>ДОБЫЧА <b>₸ {loot.toLocaleString('ru-RU')}</b></span>
            <span>УДАРЫ ПОКАЗЫВАЮТСЯ В РЕЖИМЕ РЕАЛЬНОГО ВРЕМЕНИ.</span>
          </div>
        </>
      ) : (
        <section className="result-card">
          <span>{status === 'won' ? '✓' : '⌛'}</span>
          <h2>{status === 'won' ? 'АРЕНА ОЧИЩЕНА' : 'ТЫ СБИТ'}</h2>
          <p>{status === 'won' ? 'Переходи в следующую комнату или забери кейс.' : 'Попробуй ещё раз и держись дальше от врагов.'}</p>
          <button className="primary-button" onClick={status === 'won' ? onNextRoom : onRetry}>
            {status === 'won' ? 'СЛЕДУЮЩАЯ КОМНАТА' : 'ПОВТОРИТЬ'}
          </button>
        </section>
      )}
    </section>
  );
}
