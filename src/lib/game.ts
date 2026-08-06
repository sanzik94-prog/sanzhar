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
  if (room === 1) return 1;
  if (room <= 15) return 3 + ((room - 1) % 3);
  if (room <= 30) return 4 + ((room - 16) % 4);
  if (room <= 60) return 5 + ((room - 31) % 4);
  return 6 + ((room - 61) % 5);
}

function puzzleNumber(room: number, index: number) {
  let number = index;
  for (let previous = 1; previous < room; previous += 1) number += puzzleCount(previous);
  return number + 1;
}

function digits(value: number) {
  return String(value).split('').reduce((sum, digit) => sum + Number(digit), 0);
}

export function createPuzzle(room: number, index: number) {
  const id = puzzleNumber(room, index);
  const a = 10 + ((id * 17) % 89);
  const b = 3 + ((id * 31) % 47);
  const c = 2 + ((id * 13) % 8);
  const code = 1000 + ((id * 7919) % 9000);
  const tasks = [
    ['ЧИСЛОВАЯ ПОСЛЕДОВАТЕЛЬНОСТЬ', `${a}, ${a + c}, ${a + c * 2}, ${a + c * 3}. Какое число следующее?`, String(a + c * 4)],
    ['ШИФР ЦЕЗАРЯ', `Каждая цифра кода ${code} увеличена на ${c}. Введи сумму исходных цифр и ${c}.`, String(digits(code) + c)],
    ['ЛИШНЕЕ ЧИСЛО', `В ряду ${a * 2}, ${b * 2}, ${c * 2}, ${a * 2 + 1} только одно нечётное. Введи его.`, String(a * 2 + 1)],
    ['ЗЕРКАЛЬНЫЙ КОД', `Разверни код ${code} задом наперёд.`, String(code).split('').reverse().join('')],
    ['СУММА ЦИФР', `Сложи все цифры числа ${code}.`, String(digits(code))],
    ['ЧАСЫ', `Сейчас ${c}:00. Который час будет через ${b} часов по 24-часовому кругу?`, String((c + b) % 24)],
    ['ШЕСТЕРЁНКИ', `Первая шестерёнка сделала ${a} оборотов, вторая — в ${c} раз меньше. Введи число оборотов первой, делённое на ${c}, если первая сделала ${a * c}.`, String(a)],
    ['МОСТ', `Двое идут ${b} и ${b + c} минут. Вместе они идут со скоростью медленного. Сколько минут займёт переход?`, String(b + c)],
    ['НОСКИ В ТЕМНОТЕ', `В ящике носки ${c} цветов. Сколько носков взять вслепую, чтобы точно получить пару?`, String(c + 1)],
    ['ВЗЛОМ КОДА', `Первая цифра ${c}, вторая на ${b % 7 + 1} больше. Введи сумму двух цифр.`, String(c + c + b % 7 + 1)],
    ['ВЕСЫ', `Груз ${a * c} кг разделили на ${c} равных частей. Сколько весит одна?`, String(a)],
    ['ВОЗРАСТ', `Через ${c} лет герою будет ${a + c}. Сколько ему сейчас?`, String(a)],
    ['ЛАБИРИНТ ЧИСЕЛ', `Сделай ${a} шагов вперёд, ${b} вправо и ${c} назад. Сколько шагов сделано всего?`, String(a + b + c)],
    ['ДВОИЧНЫЙ КОД', `Число ${c} записали как сумму степеней двойки. Введи само число.`, String(c)],
    ['ПРОСТОЕ ЧИСЛО', `Какое ближайшее простое число идёт после ${c === 9 ? 7 : c}?`, String(c === 2 ? 3 : c <= 4 ? 5 : c <= 6 ? 7 : 11)],
    ['МАГИЧЕСКИЙ КВАДРАТ', `В строке квадрата сумма ${a + b + c}. Уже стоят ${a} и ${b}. Какое третье число?`, String(c)],
    ['ПРОЦЕНТЫ', `Половина от ${a * 2} равна чему?`, String(a)],
    ['КАЛЕНДАРЬ', `До события ${a + c} дней, прошло ${c}. Сколько дней осталось?`, String(a)],
    ['ПРАВДА И ЛОЖЬ', `Из чисел ${a}, ${b}, ${a + b} верно, что третье равно сумме первых. Введи третье.`, String(a + b)],
    ['ЧИСЛОВАЯ ПИРАМИДА', `Нижние блоки ${a} и ${b}; верхний равен их сумме. Найди верхний.`, String(a + b)],
  ] as const;
  const task = tasks[(id - 1) % tasks.length];
  return { kind: 'code' as const, title: task[0], hint: `Уникальная задача №${id}. ${task[1]}`, answer: task[2] };
}

export function getRandomSkin() {
  return skins[Math.floor(Math.random() * skins.length)];
}
