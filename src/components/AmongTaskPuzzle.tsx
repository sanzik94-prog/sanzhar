import { useEffect, useState } from 'react';

interface AmongTaskPuzzleProps {
  task: 1 | 2 | 3 | 4;
  onSolved: () => void;
}

const TARGETS = 6;

export function AmongTaskPuzzle({ task, onSolved }: AmongTaskPuzzleProps) {
  const [cleared, setCleared] = useState<number[]>([]);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    if (task === 4 && scanning) {
      const timer = window.setTimeout(onSolved, 1800);
      return () => window.clearTimeout(timer);
    }
  }, [onSolved, scanning, task]);

  function clearTarget(index: number) {
    if (cleared.includes(index)) return;
    const next = [...cleared, index];
    setCleared(next);
    if (next.length === TARGETS) window.setTimeout(onSolved, 250);
  }

  const labels = {
    1: ['СБЕЙ АСТЕРОИДЫ', '☄'],
    2: ['ВКЛЮЧИ ЩИТЫ', '⬡'],
    3: ['ОЧИСТИ ФИЛЬТР', '🍃'],
    4: ['ЗАПУСТИ СКАНЕР', '◎'],
  } as const;
  const [title, icon] = labels[task];

  return (
    <div className={`among-task among-task-${task}`}>
      <strong>{title}</strong>
      {task === 4 ? (
        <button type="button" className={scanning ? 'scan-active' : ''} onClick={() => setScanning(true)} disabled={scanning}>
          <i>{icon}</i><span>{scanning ? 'СКАНИРОВАНИЕ…' : 'НАЧАТЬ'}</span>
        </button>
      ) : (
        <div className="among-targets">
          {Array.from({ length: TARGETS }, (_, index) => (
            <button key={index} type="button" className={cleared.includes(index) ? 'cleared' : ''}
              onClick={() => clearTarget(index)} aria-label={`${title}: ${index + 1}`}>{icon}</button>
          ))}
        </div>
      )}
      <small>{task === 4 ? 'Не отходи до завершения' : `${cleared.length} / ${TARGETS}`}</small>
    </div>
  );
}
