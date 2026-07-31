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
export const FINISH_PORTAL = { x: 116, y: 35 };
export const mazeRooms: MazeRoom[] = [
  { x: 6, y: 6, width: 28, height: 54, name: 'СТАРТ', kind: 'start' },
  { x: 41, y: 6, width: 30, height: 54, name: 'ОФИС', kind: 'office' },
  { x: 78, y: 6, width: 30, height: 87, name: 'СКЛАД', kind: 'storage' },
  { x: 115, y: 6, width: 35, height: 74, name: 'АРХИВ', kind: 'archive' },
  { x: 115, y: 100, width: 35, height: 44, name: 'ОХРАНА', kind: 'security' },
  { x: 157, y: 86, width: 37, height: 108, name: 'ВЫХОД', kind: 'exit' },
];
export const mazeDoors: MazeWall[] = [
  { x: 35, y: 63, width: 6, height: 12 },
  { x: 72, y: 91, width: 6, height: 12 },
  { x: 109, y: 46, width: 6, height: 12 },
  { x: 151, y: 79, width: 6, height: 12 },
];
export const mazeWalls: MazeWall[] = [
  { x: 0, y: 0, width: 200, height: 5 }, { x: 0, y: 195, width: 200, height: 5 },
  { x: 0, y: 0, width: 5, height: 200 }, { x: 195, y: 0, width: 5, height: 200 },
  { x: 76, y: 164, width: 6, height: 31 }, { x: 118, y: 164, width: 6, height: 31 },
  { x: 82, y: 164, width: 12, height: 6 }, { x: 106, y: 164, width: 12, height: 6 },
  { x: 58, y: 145, width: 36, height: 6 }, { x: 106, y: 145, width: 45, height: 6 },
  { x: 58, y: 118, width: 6, height: 27 }, { x: 145, y: 112, width: 6, height: 33 },
  { x: 30, y: 112, width: 34, height: 6 }, { x: 151, y: 112, width: 30, height: 6 },
  { x: 30, y: 84, width: 6, height: 28 }, { x: 175, y: 82, width: 6, height: 30 },
  { x: 36, y: 84, width: 30, height: 6 }, { x: 78, y: 84, width: 28, height: 6 },
  { x: 118, y: 84, width: 57, height: 6 }, { x: 66, y: 62, width: 6, height: 22 },
  { x: 106, y: 55, width: 6, height: 29 }, { x: 148, y: 46, width: 6, height: 38 },
  { x: 43, y: 56, width: 29, height: 6 }, { x: 84, y: 55, width: 28, height: 6 },
  { x: 124, y: 46, width: 30, height: 6 }, { x: 43, y: 28, width: 6, height: 28 },
  { x: 78, y: 22, width: 6, height: 33 }, { x: 124, y: 20, width: 6, height: 26 },
  { x: 49, y: 28, width: 17, height: 6 }, { x: 84, y: 22, width: 22, height: 6 },
  { x: 130, y: 20, width: 30, height: 6 }, { x: 160, y: 20, width: 6, height: 24 },
  { x: 18, y: 69, width: 18, height: 6 }, { x: 18, y: 69, width: 6, height: 35 },
  { x: 154, y: 64, width: 26, height: 6 }, { x: 174, y: 64, width: 6, height: 18 },
  { x: 94, y: 106, width: 6, height: 26 }, { x: 112, y: 118, width: 6, height: 27 },
  { x: 76, y: 106, width: 24, height: 6 }, { x: 118, y: 106, width: 20, height: 6 },
  { x: 70, y: 129, width: 24, height: 6 }, { x: 118, y: 132, width: 20, height: 6 },
  { x: 48, y: 98, width: 10, height: 10 }, { x: 156, y: 94, width: 11, height: 11 },
];

export function canEnterMazePosition(x: number, y: number, unlockedDoors = 4) {
  const radius = 2.5;
  return ![...mazeWalls, ...mazeDoors.slice(unlockedDoors)].some((wall) =>
    x + radius > wall.x && x - radius < wall.x + wall.width &&
    y + radius > wall.y && y - radius < wall.y + wall.height
  );
}

export function canCrossMazeGate(fromX: number, toX: number, unlockedDoors: number) {
  return mazeDoors.every((door, index) => {
    if (index < unlockedDoors) return true;
    const gateX = door.x + door.width / 2;
    return !((fromX < gateX && toX >= gateX) || (fromX > gateX && toX <= gateX));
  });
}
