import type { PuzzleKind } from '../lib/game';
import { MazePuzzle } from './MazePuzzle';
import { AmongTaskPuzzle } from './AmongTaskPuzzle';

interface PuzzleCardProps {
  puzzle: { kind: PuzzleKind; title: string; hint: string; answer: string };
  number: number;
  total: number;
  onSolved: () => void;
}

export function PuzzleCard({ puzzle, number, total, onSolved }: PuzzleCardProps) {
  const puzzleId = Number(puzzle.hint.match(/№(\d+)/)?.[1] ?? number);
  const variant = (puzzleId - 1) % 5;
  return (
    <section className="puzzle-card maze-puzzle-card">
      <div className="puzzle-top">
        <span className="eyebrow">ЛАБИРИНТ {number} ИЗ {total}</span>
        <span className="signal">● СИГНАЛ СТАБИЛЕН</span>
      </div>
      <h2>{variant === 0 ? 'НАЙДИ ВЫХОД' : 'ВЫПОЛНИ ЗАДАНИЕ'}</h2>
      {variant === 0 ? (
        <><p>Проведи маршрут от S до ★, не проходя сквозь стены</p>
          <MazePuzzle seedText={`${puzzle.hint}-${number}`} onSolved={onSolved} />
          <small>Нажимай на соседние клетки коридора</small></>
      ) : <AmongTaskPuzzle task={variant as 1 | 2 | 3 | 4} onSolved={onSolved} />}
    </section>
  );
}
