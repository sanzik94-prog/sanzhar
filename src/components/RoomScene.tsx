interface RoomSceneProps {
  solved: number;
  total: number;
}

export function RoomScene({ solved, total }: RoomSceneProps) {
  const progress = Math.round((solved / total) * 100);
  return (
    <aside className="room-scene">
      <div className="room-title"><small>КОМНАТА 3D</small><b>ГОСТИНАЯ · ЦЕЛЬ: СЕЙФ</b></div>
      <div className="iso-room">
        <div className="iso-wall wall-back"><div className="window-3d">✦</div></div>
        <div className="iso-wall wall-side" />
        <div className="iso-floor">
          <div className="object-3d couch"><i /><i /><span /></div>
          <div className="object-3d coffee-table"><span>◆</span></div>
          <div className="object-3d drawer"><i /><i /><i /></div>
          <div className="object-3d vault"><span>⌾</span><b>СЕЙФ</b></div>
          <div className="object-3d flower">✦</div>
          <div className="route-dots"><i /><i /><i /><i /></div>
        </div>
      </div>
      <div className="room-progress-3d">
        <span>ПРОГРЕСС ВЗЛОМА</span><b>{progress}%</b>
        <div><i style={{ width: `${progress}%` }} /></div>
      </div>
    </aside>
  );
}
