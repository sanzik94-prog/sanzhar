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

function puzzleNumber(room: number, index: number) {
  let number = index;
  for (let previousRoom = 1; previousRoom < room; previousRoom += 1) {
    number += puzzleCount(previousRoom);
  }
  return number;
}

function createFootballQuestion(room: number, index: number) {
  const number = puzzleNumber(room, index);
  if (number === 0) {
    return {
      question: 'В каком году Испания выиграла второй мужской чемпионат мира?',
      answer: '2026',
    };
  }

  const first = 2 + (number % 17);
  const second = 1 + ((number * 3) % 11);
  const label = `Комната ${room}, замок ${index + 1}`;
  const templates = [
    { question: `${label}: команда забила ${first} голов в первом тайме и ${second} во втором. Сколько всего?`, answer: first + second },
    { question: `${label}: игрок сделал ${first + second} ударов, ${second} не попали в створ. Сколько попали?`, answer: first },
    { question: `${label}: на секторе ${first} рядов по ${second} мест. Сколько всего мест?`, answer: first * second },
    { question: `${label}: команда набрала ${first * 3} очков за победы. Сколько побед она одержала?`, answer: first },
    { question: `${label}: футболист забил ${first} голов и отдал ${second} передач. Сколько результативных действий?`, answer: first + second },
  ];
  const selected = templates[number % templates.length];
  return { question: selected.question, answer: String(selected.answer) };
}

export function createPuzzle(room: number, index: number) {
  const puzzle = createFootballQuestion(room, index);
  return {
    kind: 'code' as const,
    title: 'Футбольный вопрос',
    hint: puzzle.question,
    answer: puzzle.answer,
  };
}

export function getRandomSkin() {
  return skins[Math.floor(Math.random() * skins.length)];
}
