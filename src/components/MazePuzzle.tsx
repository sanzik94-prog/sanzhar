import { useMemo, useState } from 'react';

interface MazePuzzleProps {
  seedText: string;
  onSolved: () => void;
}

const SIZE = 6;
const DIRECTIONS = [
  { dx: 0, dy: -1, wall: 1, opposite: 4 },
  { dx: 1, dy: 0, wall: 2, opposite: 8 },
  { dx: 0, dy: 1, wall: 4, opposite: 1 },
  { dx: -1, dy: 0, wall: 8, opposite: 2 },
];

function textSeed(text: string) {
  return [...text].reduce((seed, character) => Math.imul(seed ^ character.charCodeAt(0), 16777619), 2166136261) >>> 0;
}

function createMaze(seedText: string) {
  let seed = textSeed(seedText);
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const walls = Array<number>(SIZE * SIZE).fill(15);
  const visited = new Set<number>([0]);
  const stack = [0];
  while (stack.length) {
    const current = stack[stack.length - 1];
    const x = current % SIZE;
    const y = Math.floor(current / SIZE);
    const options = DIRECTIONS.map((direction) => ({
      ...direction,
      next: (y + direction.dy) * SIZE + x + direction.dx,
      valid: x + direction.dx >= 0 && x + direction.dx < SIZE && y + direction.dy >= 0 && y + direction.dy < SIZE,
    })).filter((option) => option.valid && !visited.has(option.next));
    if (!options.length) {
      stack.pop();
      continue;
    }
    const choice = options[Math.floor(random() * options.length)];
    walls[current] &= ~choice.wall;
    walls[choice.next] &= ~choice.opposite;
    visited.add(choice.next);
    stack.push(choice.next);
  }
  return walls;
}

export function MazePuzzle({ seedText, onSolved }: MazePuzzleProps) {
  const walls = useMemo(() => createMaze(seedText), [seedText]);
  const [path, setPath] = useState([0]);
  const [wrong, setWrong] = useState(false);
  const current = path[path.length - 1];

  function move(next: number) {
    if (next === current) return;
    const direction = DIRECTIONS.find(({ dx, dy, wall }) => {
      const expected = current + dx + dy * SIZE;
      return expected === next && !(walls[current] & wall);
    });
    if (!direction) {
      setWrong(true);
      window.setTimeout(() => setWrong(false), 350);
      return;
    }
    const nextPath = [...path, next];
    setPath(nextPath);
    if (next === SIZE * SIZE - 1) window.setTimeout(onSolved, 180);
  }

  return (
    <div className={`mini-maze ${wrong ? 'maze-wrong' : ''}`}>
      {walls.map((cellWalls, index) => (
        <button key={index} type="button" aria-label={`Клетка ${index + 1}`} onClick={() => move(index)}
          className={`${path.includes(index) ? 'maze-path' : ''} ${index === current ? 'maze-player' : ''} ${index === 0 ? 'maze-start' : ''} ${index === walls.length - 1 ? 'maze-finish' : ''}`}
          style={{
            borderTopWidth: cellWalls & 1 ? 4 : 0,
            borderRightWidth: cellWalls & 2 ? 4 : 0,
            borderBottomWidth: cellWalls & 4 ? 4 : 0,
            borderLeftWidth: cellWalls & 8 ? 4 : 0,
          }}>
          {index === 0 ? 'S' : index === walls.length - 1 ? '★' : ''}
        </button>
      ))}
    </div>
  );
}
