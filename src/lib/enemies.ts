export interface EnemyTheme {
  id: 'minotaur' | 'ghost' | 'doll' | 'robot' | 'shadow';
  name: string;
  wall: [number, number, number];
  floor: string;
  ceiling: string;
  accent: string;
  body: string;
}

const enemyThemes: EnemyTheme[] = [
  { id: 'minotaur', name: 'МИНОТАВР', wall: [122, 92, 53], floor: '#39281b', ceiling: '#5c4a31', accent: '#ff2918', body: '#4b2619' },
  { id: 'ghost', name: 'ПРИЗРАК', wall: [80, 112, 118], floor: '#19292d', ceiling: '#3d5b60', accent: '#b8ffff', body: '#b8d9d8' },
  { id: 'doll', name: 'КУКЛА', wall: [132, 91, 98], floor: '#352226', ceiling: '#65464d', accent: '#ff9aac', body: '#c8a39b' },
  { id: 'robot', name: 'СТРАЖ', wall: [82, 91, 96], floor: '#20272a', ceiling: '#4c575b', accent: '#ffb52e', body: '#434b4f' },
  { id: 'shadow', name: 'ТЕНЬ', wall: [54, 51, 68], floor: '#15131c', ceiling: '#302c3e', accent: '#b04dff', body: '#120f19' },
];

export function getEnemyTheme(room: number) {
  return enemyThemes[(room - 1) % enemyThemes.length];
}
