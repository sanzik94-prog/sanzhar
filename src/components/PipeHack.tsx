import { useState } from 'react';

interface PipeHackProps {
  onClose: () => void;
  onSolved: () => void;
}

const startingRotations = [1, 0, 1, 1, 0, 1];

export function PipeHack({ onClose, onSolved }: PipeHackProps) {
  const [rotations, setRotations] = useState(startingRotations);

  function rotatePipe(index: number) {
    const next = rotations.map((rotation, pipeIndex) =>
      pipeIndex === index ? (rotation + 1) % 2 : rotation
    );
    setRotations(next);
    if (next.every((rotation) => rotation === 0)) {
      window.setTimeout(onSolved, 350);
    }
  }

  return (
    <div className="pipe-hack-backdrop">
      <section className="pipe-hack">
        <header>
          <div><span>ВЗЛОМ ДВЕРИ</span><b>СОЕДИНИ ТРУБЫ</b></div>
          <button type="button" onClick={onClose}>×</button>
        </header>
        <div className="pipe-board">
          <i className="pipe-terminal pipe-start" />
          {rotations.map((rotation, index) => (
            <button
              type="button"
              className="pipe-tile"
              key={index}
              onClick={() => rotatePipe(index)}
              aria-label={`Повернуть трубу ${index + 1}`}
            >
              <i style={{ transform: `rotate(${rotation * 90}deg)` }} />
            </button>
          ))}
          <i className="pipe-terminal pipe-finish" />
        </div>
        <p>Нажимай на плитки, пока все трубы не соединятся.</p>
      </section>
    </div>
  );
}
