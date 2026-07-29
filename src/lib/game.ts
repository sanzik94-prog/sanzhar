export type PuzzleKind = 'code' | 'memory' | 'math';

export interface Skin {
  name: string;
  icon: string;
  rarity: 'Обычный' | 'Редкий' | 'Эпический' | 'Легендарный';
}

export const skins: Skin[] = [
  { name: 'Ночной вор', icon: '🥷', rarity: 'Обычный' },
  { name: 'Бэтмен', icon: '🦇', rarity: 'Легендарный' },
  { name: 'Человек-паук', icon: '🕷️', rarity: 'Легендарный' },
  { name: 'Веном', icon: '🖤', rarity: 'Легендарный' },
  { name: 'Железный человек', icon: '🤖', rarity: 'Эпический' },
  { name: 'Капитан Америка', icon: '🛡️', rarity: 'Эпический' },
  { name: 'Тор', icon: '⚡', rarity: 'Эпический' },
  { name: 'Халк', icon: '💚', rarity: 'Эпический' },
  { name: 'Чёрная вдова', icon: '🕶️', rarity: 'Редкий' },
  { name: 'Соколиный глаз', icon: '🏹', rarity: 'Редкий' },
  { name: 'Чёрная пантера', icon: '🐾', rarity: 'Эпический' },
  { name: 'Доктор Стрэндж', icon: '🔮', rarity: 'Эпический' },
  { name: 'Человек-муравей', icon: '🐜', rarity: 'Редкий' },
  { name: 'Оса', icon: '🐝', rarity: 'Редкий' },
  { name: 'Капитан Марвел', icon: '🌟', rarity: 'Эпический' },
  { name: 'Звёздный Лорд', icon: '🎧', rarity: 'Редкий' },
  { name: 'Грут', icon: '🌱', rarity: 'Редкий' },
  { name: 'Ракета', icon: '🦝', rarity: 'Редкий' },
  { name: 'Локи', icon: '🐍', rarity: 'Эпический' },
  { name: 'Лунный рыцарь', icon: '🌙', rarity: 'Редкий' },
];

export function puzzleCount(room: number) {
  if (room <= 5) return 3 + (room % 2);
  if (room <= 8) return 5 + (room % 3);
  if (room <= 40) return 10 + (room % 4);
  return 15 + (room % 6);
}

export function roomTime(room: number) {
  return 28 + room * 2;
}

export function createPuzzle(room: number, index: number) {
  const kind = ['code', 'memory', 'math'][(room + index) % 3] as PuzzleKind;
  const seed = room * 7 + index * 3;
  if (kind === 'math') {
    const left = 3 + (seed % 12);
    const right = 2 + ((seed * 2) % 9);
    return { kind, title: 'Сигнализация', hint: `${left} + ${right} = ?`, answer: String(left + right) };
  }
  if (kind === 'memory') {
    const symbols = ['◆', '●', '▲', '■'];
    const answer = Array.from({ length: Math.min(3 + Math.floor(room / 20), 5) }, (_, i) => symbols[(seed + i * 3) % 4]).join('');
    return { kind, title: 'Сейф памяти', hint: answer, answer };
  }
  const answer = String(1000 + ((seed * 137) % 9000));
  return { kind, title: 'Кодовый замок', hint: answer.split('').reverse().join(' · '), answer };
}

export function getRandomSkin() {
  return skins[Math.floor(Math.random() * skins.length)];
}
