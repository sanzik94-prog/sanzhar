const STARTING_BALANCE = 16_000;
const GIFT_KEY = 'shadow-16000-gift-claimed';

export function loadBalance() {
  if (localStorage.getItem(GIFT_KEY) !== 'yes') {
    localStorage.setItem('shadow-loot', String(STARTING_BALANCE));
    localStorage.setItem(GIFT_KEY, 'yes');
    return STARTING_BALANCE;
  }
  return Number(localStorage.getItem('shadow-loot') ?? 0);
}
