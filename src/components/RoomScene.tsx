import { BackroomsMap } from './BackroomsMap';

interface RoomSceneProps {
  solved: number;
  total: number;
  onCaught: () => void;
  onFinish: () => void;
  room: number;
}

export function RoomScene({ solved, total, onCaught, onFinish, room }: RoomSceneProps) {
  return (
    <aside className="room-scene">
      <BackroomsMap solved={solved} total={total} onCaught={onCaught} onFinish={onFinish} room={room} />
    </aside>
  );
}
