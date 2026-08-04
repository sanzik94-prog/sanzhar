import type { PuzzleKind } from '../lib/game';
import { MazePuzzle } from './MazePuzzle';

interface PuzzleCardProps {
  puzzle: { kind: PuzzleKind; title: string; hint: string; answer: string };
  number: number;
  total: number;
  onSolved: () => void;
}

export function PuzzleCard({ puzzle, number, total, onSolved }: PuzzleCardProps) {
  return (
    <section className="puzzle-card maze-puzzle-card">
      <div className="puzzle-top">
        <span className="eyebrow">ЛАБИРИНТ {number} ИЗ {total}</span>
        <span className="signal">● СИГНАЛ СТАБИЛЕН</span>
      </div>
      <h2>НАЙДИ ВЫХОД</h2>
      <p>Проведи маршрут от S до ★, не проходя сквозь стены</p>
      <MazePuzzle seedText={`${puzzle.hint}-${number}`} onSolved={onSolved} />
      <small>Нажимай на соседние клетки коридора</small>
    </section>
  );
}
