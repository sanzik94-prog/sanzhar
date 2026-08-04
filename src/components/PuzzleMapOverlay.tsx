interface PuzzleMapOverlayProps {
  solved: number;
  total: number;
}

const POINTS = [
  [16, 72], [35, 84], [56, 75], [74, 58], [52, 45],
  [70, 29], [88, 37], [82, 61], [91, 80], [62, 88],
];

export function PuzzleMapOverlay({ solved, total }: PuzzleMapOverlayProps) {
  return (
    <aside className="puzzle-map-overlay">
      <div className="puzzle-map-title">КАРТА ГОЛОВОЛОМОК <b>{solved}/{total}</b></div>
      <svg viewBox="0 0 110 100" role="img" aria-label="Карта комнаты с головоломками">
        <path className="map-corridor-outline" d="M8 94V58H14V10H27V53H38V36H48V18H94V36H72V49H94V88H82V94Z" />
        <path className="map-route-line" d="M15 78L34 85L56 76L74 58L52 45L70 29L88 37L82 61L91 80L62 88" />
        {POINTS.slice(0, total).map(([x, y], index) => {
          const state = index < solved ? 'solved' : index === solved ? 'current' : 'locked';
          return (
            <g key={index} className={`puzzle-map-node ${state}`} transform={`translate(${x} ${y})`}>
              <circle r="6" />
              <text textAnchor="middle" dominantBaseline="central">{index + 1}</text>
            </g>
          );
        })}
        <path className="map-exit" d="M96 84l8 4-8 4z" />
      </svg>
    </aside>
  );
}
