import { useEffect, useState } from 'react';
import type { PuzzleKind } from '../lib/game';

interface PuzzleCardProps {
  puzzle: { kind: PuzzleKind; title: string; hint: string; answer: string };
  number: number;
  total: number;
  onSolved: () => void;
}

export function PuzzleCard({ puzzle, number, total, onSolved }: PuzzleCardProps) {
  const [value, setValue] = useState('');
  const [showHint, setShowHint] = useState(puzzle.kind !== 'memory');
  const [wrong, setWrong] = useState(false);

  useEffect(() => {
    if (puzzle.kind !== 'memory') return;
    const timer = window.setTimeout(() => setShowHint(false), 1800);
    return () => window.clearTimeout(timer);
  }, [puzzle]);

  function checkAnswer() {
    const normalized = value.replace(/\s/g, '').toUpperCase();
    if (normalized === puzzle.answer.toUpperCase()) onSolved();
    else {
      setWrong(true);
      setValue('');
      window.setTimeout(() => setWrong(false), 500);
    }
  }

  return (
    <section className={`puzzle-card ${wrong ? 'shake' : ''}`}>
      <div className="puzzle-top">
        <span className="eyebrow">ЗАДАЧА {number} ИЗ {total}</span>
        <span className="signal">● СИГНАЛ СТАБИЛЕН</span>
      </div>
      <div className="lock-icon">{puzzle.kind === 'math' ? '⚡' : puzzle.kind === 'memory' ? '◈' : '⌗'}</div>
      <h2>{puzzle.title}</h2>
      <p>{puzzle.kind === 'memory' ? 'Запомни последовательность символов' : 'Введи правильный ответ'}</p>
      <div className="puzzle-clue">{showHint ? puzzle.hint : '•  •  •  •'}</div>
      <input autoFocus value={value} onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => event.key === 'Enter' && checkAnswer()}
        placeholder={puzzle.kind === 'memory' ? 'Введи символы без пробелов' : 'Твой ответ'} />
      <button className="primary-button" onClick={checkAnswer}>ВЗЛОМАТЬ ЗАМОК <span>→</span></button>
      <small>Enter — подтвердить</small>
    </section>
  );
}
