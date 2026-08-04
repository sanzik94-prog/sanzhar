import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import { GameHeader } from '../components/GameHeader';
import { PuzzleCard } from '../components/PuzzleCard';
import { RoomScene } from '../components/RoomScene';
import { createPuzzle, puzzleCount, skins } from '../lib/game';
import { loadBalance } from '../lib/wallet';

const ROOM_REWARD = 2_000;

export function GamePage() {
  const [, navigate] = useLocation();
  const [room, setRoom] = useState(() => Number(localStorage.getItem('shadow-room') ?? 1));
  const [loot, setLoot] = useState(loadBalance);
  const [solved, setSolved] = useState(0);
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [puzzleOpen, setPuzzleOpen] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const total = puzzleCount(room);
  const puzzle = useMemo(() => createPuzzle(room, solved), [room, solved]);

  useEffect(() => {
    function openPuzzle() {
      if (status !== 'playing') return;
      setPuzzleOpen(true);
    }
    window.addEventListener('backrooms-door-approach', openPuzzle);
    return () => window.removeEventListener('backrooms-door-approach', openPuzzle);
  }, [status]);

  function solvePuzzle() {
    setPuzzleOpen(false);
    setSolved((value) => Math.min(value + 1, total));
  }

  function nextRoom() {
    const upcomingRoom = Math.min(room + 1, 100);
    setRoom(upcomingRoom);
    setAttempt((value) => value + 1);
    setSolved(0);
    setPuzzleOpen(false);
    setAttempt((value) => value + 1);
    setStatus('playing');
  }

  function startReplay() {
    setAttempt((value) => value + 1);
    setStatus('playing');
    setSolved(0);
    setPuzzleOpen(false);
  }

  function enterNextRoom() {
    const upcomingRoom = Math.min(room + 1, 100);
    setLoot((value) => {
      const nextLoot = value + ROOM_REWARD;
      localStorage.setItem('shadow-loot', String(nextLoot));
      return nextLoot;
    });
    localStorage.setItem('shadow-room', String(upcomingRoom));
    setRoom(upcomingRoom);
    setSolved(0);
    setPuzzleOpen(false);
    setStatus('playing');
    setAttempt((value) => value + 1);
  }

  useEffect(() => {
    function replayWithKeyboard(event: KeyboardEvent) {
      if (status === 'lost' && event.key.toLowerCase() === 'r') startReplay();
    }
    window.addEventListener('keydown', replayWithKeyboard);
    return () => window.removeEventListener('keydown', replayWithKeyboard);
  }, [status, room]);

  const earned = ROOM_REWARD;
  const selectedSkin = Number(localStorage.getItem('shadow-selected-skin') ?? 0);
  return (
    <main className="game-page">
      <GameHeader room={room} loot={loot} skinIcon={skins[selectedSkin]?.icon ?? skins[0].icon} onExit={() => navigate('/')} />
      <div className={`game-grid ${puzzleOpen || status !== 'playing' ? 'puzzle-is-open' : ''}`}>
        <div className="puzzle-column">
          {status === 'playing' && puzzleOpen && (
            <PuzzleCard key={`${room}-${solved}`} puzzle={puzzle} number={solved + 1}
              total={total} onSolved={solvePuzzle} />
          )}
          {status !== 'playing' && (
            <section className="result-card">
              <span>{status === 'won' ? '✓' : '⌛'}</span>
              <h2>{status === 'won' ? 'КОМНАТА ОГРАБЛЕНА' : 'ХОЗЯИН ВЕРНУЛСЯ'}</h2>
              <p>{status === 'won' ? `Добыча: ₸ ${earned.toLocaleString('ru-RU')}` : 'Попробуй ещё раз и действуй быстрее.'}</p>
              <button type="button" className="primary-button" onClick={status === 'won' ? nextRoom : startReplay}>
                {status === 'won' ? 'СЛЕДУЮЩАЯ КОМНАТА' : 'REPLAY'}
              </button>
            </section>
          )}
        </div>
        <RoomScene key={`${room}-${attempt}`} solved={status === 'won' ? total : solved} total={total}
          onCaught={() => status === 'playing' && setStatus('lost')} onFinish={enterNextRoom} room={room} />
      </div>
    </main>
  );
}
