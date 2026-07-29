import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import { CaseModal } from '../components/CaseModal';
import { GameHeader } from '../components/GameHeader';
import { PuzzleCard } from '../components/PuzzleCard';
import { RoomScene } from '../components/RoomScene';
import { createPuzzle, getRandomSkin, puzzleCount, roomTime, skins } from '../lib/game';

export function GamePage() {
  const [, navigate] = useLocation();
  const [room, setRoom] = useState(() => Number(localStorage.getItem('shadow-room') ?? 1));
  const [loot, setLoot] = useState(() => Number(localStorage.getItem('shadow-loot') ?? 0));
  const [solved, setSolved] = useState(0);
  const [time, setTime] = useState(() => roomTime(room));
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [caseReward, setCaseReward] = useState<ReturnType<typeof getRandomSkin> | null>(null);
  const total = puzzleCount(room);
  const puzzle = useMemo(() => createPuzzle(room, solved), [room, solved]);

  useEffect(() => {
    if (status !== 'playing') return;
    const timer = window.setInterval(() => setTime((current) => {
      if (current <= 1) {
        setStatus('lost');
        return 0;
      }
      return current - 1;
    }), 1000);
    return () => window.clearInterval(timer);
  }, [status, room]);

  function solvePuzzle() {
    if (solved + 1 < total) {
      setSolved((value) => value + 1);
      return;
    }
    const earned = total * 750 + time * 50;
    const nextRoom = Math.min(room + 1, 100);
    setLoot((value) => {
      localStorage.setItem('shadow-loot', String(value + earned));
      return value + earned;
    });
    localStorage.setItem('shadow-room', String(nextRoom));
    setStatus('won');
    if (room % 5 === 0) setCaseReward(getRandomSkin());
  }

  function nextRoom() {
    const upcomingRoom = Math.min(room + 1, 100);
    setRoom(upcomingRoom);
    setSolved(0);
    setTime(roomTime(upcomingRoom));
    setStatus('playing');
  }

  function collectCase() {
    if (!caseReward) return;
    const id = skins.findIndex((skin) => skin.name === caseReward.name);
    const owned = JSON.parse(localStorage.getItem('shadow-skins') ?? '[0]') as number[];
    localStorage.setItem('shadow-skins', JSON.stringify([...new Set([...owned, id])]));
    setCaseReward(null);
  }

  function retry() {
    setSolved(0);
    setTime(roomTime(room));
    setStatus('playing');
  }

  const earned = total * 750 + time * 50;
  return (
    <main className="game-page">
      <GameHeader room={room} loot={loot} skinIcon={skins[0].icon} onExit={() => navigate('/')} />
      <div className="timer-bar">
        <span>ВРЕМЯ ДО ВОЗВРАЩЕНИЯ ХОЗЯИНА</span>
        <b className={time < 10 ? 'danger' : ''}>00:{String(time).padStart(2, '0')}</b>
        <i style={{ width: `${(time / roomTime(room)) * 100}%` }} />
      </div>
      <div className="game-grid">
        <div className="puzzle-column">
          {status === 'playing' && (
            <PuzzleCard key={`${room}-${solved}`} puzzle={puzzle} number={solved + 1}
              total={total} onSolved={solvePuzzle} />
          )}
          {status !== 'playing' && (
            <section className="result-card">
              <span>{status === 'won' ? '✓' : '⌛'}</span>
              <h2>{status === 'won' ? 'КОМНАТА ОГРАБЛЕНА' : 'ХОЗЯИН ВЕРНУЛСЯ'}</h2>
              <p>{status === 'won' ? `Добыча: ₸ ${earned.toLocaleString('ru-RU')}` : 'Попробуй ещё раз и действуй быстрее.'}</p>
              <button className="primary-button" onClick={status === 'won' ? nextRoom : retry}>
                {status === 'won' ? 'СЛЕДУЮЩАЯ КОМНАТА' : 'ПОВТОРИТЬ'}
              </button>
            </section>
          )}
        </div>
        <RoomScene solved={status === 'won' ? total : solved} total={total} />
      </div>
      {caseReward && <CaseModal skin={caseReward} isNew onClose={collectCase} />}
    </main>
  );
}
