const STARTING_BALANCE = 0;

export function loadBalance() {
  const savedBalance = localStorage.getItem('shadow-loot');
  if (savedBalance === null) {
    localStorage.setItem('shadow-loot', String(STARTING_BALANCE));
    return STARTING_BALANCE;
  }
  return Number(savedBalance);
}
