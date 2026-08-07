export interface MazeWall {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface MazeRoom extends MazeWall {
  name: string;
  kind: 'start' | 'office' | 'storage' | 'archive' | 'security' | 'exit';
}

export const MAP_SIZE = 200;
export const FINISH_PORTAL = { x: 160, y: 25 };
export const mazeRooms: MazeRoom[] = [
  { x: 6, y: 6, width: 28, height: 54, name: 'СТАРТ', kind: 'start' },
  { x: 41, y: 6, width: 30, height: 54, name: 'ОФИС', kind: 'office' },
  { x: 78, y: 6, width: 30, height: 87, name: 'СКЛАД', kind: 'storage' },
  { x: 115, y: 6, width: 35, height: 74, name: 'АРХИВ', kind: 'archive' },
  { x: 115, y: 100, width: 35, height: 44, name: 'ОХРАНА', kind: 'security' },
  { x: 157, y: 86, width: 37, height: 108, name: 'ВЫХОД', kind: 'exit' },
];
export const mazeDoors: MazeWall[] = [
  { x: 63, y: 150, width: 34, height: 5 }, { x: 63, y: 120, width: 34, height: 5 },
  { x: 63, y: 90, width: 34, height: 5 }, { x: 63, y: 60, width: 34, height: 5 },
  { x: 103, y: 65, width: 34, height: 5 }, { x: 103, y: 95, width: 34, height: 5 },
  { x: 103, y: 125, width: 34, height: 5 }, { x: 103, y: 145, width: 34, height: 5 },
  { x: 143, y: 140, width: 34, height: 5 }, { x: 143, y: 100, width: 34, height: 5 },
];
export const mazeWalls: MazeWall[] = [
  { x: 20, y: 10, width: 160, height: 5 }, { x: 20, y: 185, width: 160, height: 5 },
  { x: 20, y: 10, width: 5, height: 180 }, { x: 175, y: 10, width: 5, height: 180 },
  { x: 60, y: 10, width: 5, height: 145 },
  { x: 100, y: 45, width: 5, height: 145 },
  { x: 140, y: 10, width: 5, height: 145 },
];

export function getMazeLayout(_room: number, puzzleTotal = 4) {
  return { walls: mazeWalls, doors: mazeDoors.slice(0, puzzleTotal), rooms: mazeRooms };
}

export function canEnterMazePosition(
  x: number,
  y: number,
  unlockedDoors = 4,
  walls = mazeWalls,
  doors = mazeDoors,
) {
  const radius = 2.5;
  return ![...walls, ...doors.slice(unlockedDoors)].some((wall) =>
    x + radius > wall.x && x - radius < wall.x + wall.width &&
    y + radius > wall.y && y - radius < wall.y + wall.height
  );
}

export function canCrossMazeGate(fromX: number, toX: number, unlockedDoors: number, doors = mazeDoors) {
  return doors.every((door, index) => {
    if (index < unlockedDoors) return true;
    const gateX = door.x + door.width / 2;
    return !((fromX < gateX && toX >= gateX) || (fromX > gateX && toX <= gateX));
  });
}
