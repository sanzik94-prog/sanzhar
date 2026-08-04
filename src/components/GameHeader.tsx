import { CoinAmount } from './CoinAmount';

interface GameHeaderProps {
  room: number;
  loot: number;
  skinIcon: string;
  onExit: () => void;
}

export function GameHeader({ room, loot, skinIcon, onExit }: GameHeaderProps) {
  return (
    <header className="game-header">
      <button className="icon-button" onClick={onExit} aria-label="Выйти в меню">←</button>
      <div className="brand"><span className="brand-mark">S</span><b>SHADOW<br />HEIST</b></div>
      <div className="header-stats">
        <span>КОМНАТА <b>{room}</b></span>
        <span>МОНЕТЫ <b><CoinAmount amount={loot} /></b></span>
        <span className="avatar">{skinIcon}</span>
      </div>
    </header>
  );
}
