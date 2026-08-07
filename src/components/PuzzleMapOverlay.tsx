interface PuzzleMapOverlayProps {
  solved: number;
  total: number;
}

const GATES = [
  [31, 76], [31, 63], [31, 50], [31, 37], [55, 39],
  [55, 52], [55, 65], [55, 74], [79, 70], [79, 53],
];

export function PuzzleMapOverlay({ solved, total }: PuzzleMapOverlayProps) {
  return (
    <aside className="puzzle-map-overlay">
      <div className="puzzle-map-title">КАРТА ГОЛОВОЛОМОК <b>{solved}/{total}</b></div>
      <svg viewBox="0 0 110 100" role="img" aria-label="Карта коридоров с жёлтыми головоломками">
        <path className="map-corridor-outline" d="M12 92V8H94V92H12M36 8V78M58 24V92M80 8V78" />
        <path className="map-route-line" d="M47 88V16H69V85H88V14" />
        {GATES.slice(0, total).map(([x, y], index) => {
          const state = index < solved ? 'solved' : index === solved ? 'current' : 'locked';
          return (
            <g key={index} className={`puzzle-map-gate ${state}`} transform={`translate(${x} ${y})`}>
              <line x1="-8" x2="8" />
              <text textAnchor="middle" y="-2">{index + 1}</text>
            </g>
          );
        })}
        <path className="map-exit" d="M86 9l5 8H81z" />
      </svg>
    </aside>
  );
}
